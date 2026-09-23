import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as parser from '@babel/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDryRun = process.argv.includes('--dry-run');

function getAllFiles(dir, exts) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        files = files.concat(getAllFiles(fullPath, exts));
      }
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

function isDirective(val) {
  const trimmed = val.trim();
  return (
    trimmed.startsWith('@ts-') ||
    trimmed.startsWith('eslint-') ||
    trimmed.startsWith('prettier-ignore') ||
    trimmed.startsWith('stylelint-') ||
    trimmed.startsWith('istanbul ignore') ||
    trimmed.startsWith('c8 ignore')
  );
}

function isJSDoc(comment) {
  return comment.type === 'CommentBlock' && comment.value.startsWith('*');
}

function cleanFile(code, filePath) {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx', 'decorators-legacy'],
  });

  const rangesToRemove = [];
  const handledCommentStarts = new Set();
  let consoleLogCount = 0;
  let commentCount = 0;

  function isOnlyWhitespaceBefore(pos) {
    let i = pos - 1;
    while (i >= 0 && code[i] !== '\n') {
      if (code[i] !== ' ' && code[i] !== '\t' && code[i] !== '\r') return false;
      i--;
    }
    return true;
  }

  function getLineStart(pos) {
    let i = pos;
    while (i > 0 && code[i - 1] !== '\n') {
      i--;
    }
    return i;
  }

  function getLineEnd(pos) {
    let i = pos;
    while (i < code.length && (code[i] === ' ' || code[i] === '\t')) {
      i++;
    }
    if (code[i] === '\r') i++;
    if (code[i] === '\n') i++;
    return i;
  }

  // 1. Walk AST for console.log and JSX comments
  function walk(node) {
    if (!node || typeof node !== 'object') return;

    // Special check for debug property in websocket.ts
    if (
      node.type === 'ObjectProperty' &&
      node.key &&
      node.key.name === 'debug' &&
      code.slice(node.start, node.end).includes('console.log')
    ) {
      consoleLogCount++;
      const lineStart = getLineStart(node.start);
      let lineEnd = node.end;
      // Skip trailing comma and whitespace
      while (lineEnd < code.length && (code[lineEnd] === ' ' || code[lineEnd] === '\t' || code[lineEnd] === ',')) {
        lineEnd++;
      }
      if (code[lineEnd] === '\r') lineEnd++;
      if (code[lineEnd] === '\n') lineEnd++;
      rangesToRemove.push({ start: lineStart, end: lineEnd });
      return; // Do not walk children of removed property
    }

    // ExpressionStatement wrapping console.log
    if (
      node.type === 'ExpressionStatement' &&
      node.expression &&
      node.expression.type === 'CallExpression' &&
      node.expression.callee &&
      node.expression.callee.type === 'MemberExpression' &&
      node.expression.callee.object &&
      node.expression.callee.object.name === 'console' &&
      node.expression.callee.property &&
      node.expression.callee.property.name === 'log'
    ) {
      consoleLogCount++;
      const lineStart = getLineStart(node.start);
      if (isOnlyWhitespaceBefore(node.start)) {
        const lineEnd = getLineEnd(node.end);
        rangesToRemove.push({ start: lineStart, end: lineEnd });
      } else {
        rangesToRemove.push({ start: node.start, end: node.end });
      }
    }

    // JSXExpressionContainer wrapping JSXEmptyExpression ({/* comment */})
    if (
      node.type === 'JSXExpressionContainer' &&
      node.expression &&
      node.expression.type === 'JSXEmptyExpression'
    ) {
      commentCount++;
      // Mark inner comments as handled
      for (const c of ast.comments) {
        if (c.start >= node.start && c.end <= node.end) {
          handledCommentStarts.add(c.start);
        }
      }

      const lineStart = getLineStart(node.start);
      if (isOnlyWhitespaceBefore(node.start)) {
        const lineEnd = getLineEnd(node.end);
        rangesToRemove.push({ start: lineStart, end: lineEnd });
      } else {
        rangesToRemove.push({ start: node.start, end: node.end });
      }
    }

    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'comments') continue;
      const child = node[key];
      if (Array.isArray(child)) {
        child.forEach(walk);
      } else if (typeof child === 'object') {
        walk(child);
      }
    }
  }

  walk(ast);

  // 2. Process all comments in ast.comments
  for (const c of ast.comments) {
    if (handledCommentStarts.has(c.start)) continue;

    // Preserved: directives (@ts-*, eslint-*)
    if (isDirective(c.value)) continue;

    // Preserved: JSDoc (/** ... */)
    if (isJSDoc(c)) continue;

    commentCount++;

    if (c.type === 'CommentLine') {
      const lineStart = getLineStart(c.start);
      if (isOnlyWhitespaceBefore(c.start)) {
        const lineEnd = getLineEnd(c.end);
        rangesToRemove.push({ start: lineStart, end: lineEnd });
      } else {
        // Trailing comment: strip preceding whitespace on same line
        let s = c.start;
        while (s > lineStart && (code[s - 1] === ' ' || code[s - 1] === '\t')) {
          s--;
        }
        rangesToRemove.push({ start: s, end: c.end });
      }
    } else if (c.type === 'CommentBlock') {
      const lineStart = getLineStart(c.start);
      if (isOnlyWhitespaceBefore(c.start)) {
        const lineEnd = getLineEnd(c.end);
        rangesToRemove.push({ start: lineStart, end: lineEnd });
      } else {
        rangesToRemove.push({ start: c.start, end: c.end });
      }
    }
  }

  if (rangesToRemove.length === 0) {
    return { code, modified: false, commentCount: 0, consoleLogCount: 0 };
  }

  // Sort ascending by start for clean interval merging
  rangesToRemove.sort((a, b) => a.start - b.start);

  // Merge overlapping or contiguous ranges
  const merged = [];
  for (const r of rangesToRemove) {
    if (merged.length > 0) {
      const prev = merged[merged.length - 1];
      if (r.start <= prev.end) {
        prev.end = Math.max(prev.end, r.end);
        continue;
      }
    }
    merged.push({ ...r });
  }

  // Sort descending by start to slice from end to beginning without shifting offsets
  merged.sort((a, b) => b.start - a.start);

  let result = code;
  for (const r of merged) {
    result = result.slice(0, r.start) + result.slice(r.end);
  }

  // Normalize excessive blank lines (more than 2 consecutive newlines)
  result = result.replace(/\n{3,}/g, '\n\n');

  // Validate that result is still syntactically valid code!
  try {
    parser.parse(result, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'decorators-legacy'],
    });
  } catch (err) {
    throw new Error(`Syntax validation failed for ${filePath}: ${err.message}`);
  }

  return {
    code: result,
    modified: result !== code,
    commentCount,
    consoleLogCount,
  };
}

async function main() {
  const srcDir = path.join(__dirname, '..', 'src');
  const files = getAllFiles(srcDir, ['.ts', '.tsx']);

  console.log(`Starting cleanup across ${files.length} files in ${srcDir}...`);
  if (isDryRun) {
    console.log('Running in DRY-RUN mode (no files will be written)');
  }

  let totalModified = 0;
  let totalCommentsRemoved = 0;
  let totalLogsRemoved = 0;
  const modifiedFiles = [];

  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    const { code, modified, commentCount, consoleLogCount } = cleanFile(original, file);

    if (modified) {
      totalModified++;
      totalCommentsRemoved += commentCount;
      totalLogsRemoved += consoleLogCount;
      modifiedFiles.push(file);

      if (!isDryRun) {
        fs.writeFileSync(file, code, 'utf8');
      }
    }
  }

  console.log('\n=== CLEANUP SUMMARY ===');
  console.log(`Total files scanned:       ${files.length}`);
  console.log(`Files modified:           ${totalModified}`);
  console.log(`Comments removed:          ${totalCommentsRemoved}`);
  console.log(`console.log calls removed: ${totalLogsRemoved}`);

  if (isDryRun) {
    console.log('\nDry run completed successfully with 0 errors.');
  } else {
    console.log('\nAll files written and AST-validated with 0 errors.');
  }

  return modifiedFiles;
}

main().catch((err) => {
  console.error('Execution failed:', err);
  process.exit(1);
});
