import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const geo63 = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/maps/vn-63-provinces.geojson'), 'utf8'));
const geo34 = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/maps/vn-34-provinces.geojson'), 'utf8'));

// Extract coords
const coords63 = {};
for (const f of geo63.features) {
  coords63[f.properties.code] = {
    code: f.properties.code,
    name: f.properties.name,
    center: f.properties.center,
    bbox: f.bbox,
  };
}

const coords34 = {};
for (const f of geo34.features) {
  coords34[f.properties.code] = {
    code: f.properties.code,
    name: f.properties.name,
    bbox: f.bbox,
    constituentNames: f.properties.constituentNames || [],
  };
}

function normalizeSearchStr(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const PROVINCE_ALIASES = {
  'sai gon': { code63: '79', code34: '79' },
  'saigon': { code63: '79', code34: '79' },
  'tphcm': { code63: '79', code34: '79' },
  'tp hcm': { code63: '79', code34: '79' },
  'tp ho chi minh': { code63: '79', code34: '79' },
  'thanh pho ho chi minh': { code63: '79', code34: '79' },
  'thu do ha noi': { code63: '01', code34: '01' },
  'ha noi': { code63: '01', code34: '01' },
  'hue': { code63: '46', code34: '46' },
  'thua thien hue': { code63: '46', code34: '46' },
  'vung tau': { code63: '77', code34: '79' },
  'ba ria': { code63: '77', code34: '79' },
  'ba ria vung tau': { code63: '77', code34: '79' },
  'da lat': { code63: '68', code34: '68' },
  'dalat': { code63: '68', code34: '68' },
  'buon ma thuot': { code63: '66', code34: '66' },
  'bmt': { code63: '66', code34: '66' },
  'pleiku': { code63: '64', code34: '64' },
  'nha trang': { code63: '56', code34: '56' },
  'phan thiet': { code63: '60', code34: '68' },
  'quy nhon': { code63: '52', code34: '64' },
  'dak lak': { code63: '66', code34: '66' },
  'daklak': { code63: '66', code34: '66' },
  'dac lac': { code63: '66', code34: '66' },
  'dak nong': { code63: '67', code34: '68' },
  'daknong': { code63: '67', code34: '68' },
  'dac nong': { code63: '67', code34: '68' },
  'binh duong': { code63: '74', code34: '79' },
  'dong nai': { code63: '75', code34: '75' },
};

function searchProvinces(query, mode = '63', limit = 5) {
  const q = normalizeSearchStr(query);
  if (!q) return [];
  const qCompact = q.replace(/\s+/g, '');

  const map = mode === '34' ? coords34 : coords63;
  const results = [];

  const alias = PROVINCE_ALIASES[q] || PROVINCE_ALIASES[qCompact];
  const priorityCode = alias ? (mode === '34' ? alias.code34 : alias.code63) : undefined;

  for (const item of Object.values(map)) {
    const normName = normalizeSearchStr(item.name);
    const compactName = normName.replace(/\s+/g, '');
    let score = 0;
    let matchLabel = item.name;

    if (item.code === priorityCode) {
      score = 100;
    } else if (normName === q || compactName === qCompact) {
      score = 90;
    } else if (normName.startsWith(q) || compactName.startsWith(qCompact)) {
      score = 80;
    } else if (normName.includes(q) || compactName.includes(qCompact)) {
      score = 70;
    } else if (mode === '34' && item.constituentNames) {
      for (const cName of item.constituentNames) {
        const normC = normalizeSearchStr(cName);
        const compactC = normC.replace(/\s+/g, '');
        if (normC === q || compactC === qCompact) {
          score = 75;
          matchLabel = `${item.name} (gồm ${cName})`;
          break;
        } else if (normC.includes(q) || compactC.includes(qCompact)) {
          score = 65;
          matchLabel = `${item.name} (gồm ${cName})`;
          break;
        }
      }
    }

    if (score > 0) {
      results.push({
        code: item.code,
        name: item.name,
        displayName: matchLabel,
        score,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

// 1. Test searching every single one of 63 provinces by raw name and normalized name
console.log('--- Testing 63 Provinces Search ---');
let fail63 = 0;
for (const p of Object.values(coords63)) {
  const res1 = searchProvinces(p.name, '63');
  const res2 = searchProvinces(normalizeSearchStr(p.name), '63');
  if (!res1.length || res1[0].code !== p.code) {
    console.error(`FAILED raw: "${p.name}"`);
    fail63++;
  }
  if (!res2.length || res2[0].code !== p.code) {
    console.error(`FAILED normalized: "${normalizeSearchStr(p.name)}" for ${p.name}`);
    fail63++;
  }
}
console.log(`63 provinces test done. Failures: ${fail63}`);

// 2. Test searching 34 provinces
console.log('--- Testing 34 Provinces Search ---');
let fail34 = 0;
for (const p of Object.values(coords34)) {
  const res1 = searchProvinces(p.name, '34');
  const res2 = searchProvinces(normalizeSearchStr(p.name), '34');
  if (!res1.length || res1[0].code !== p.code) {
    console.error(`FAILED 34 raw: "${p.name}"`);
    fail34++;
  }
  if (!res2.length || res2[0].code !== p.code) {
    console.error(`FAILED 34 normalized: "${normalizeSearchStr(p.name)}" for ${p.name}`);
    fail34++;
  }
}
console.log(`34 provinces test done. Failures: ${fail34}`);

// 3. Test tricky queries
const trickyQueries = [
  { q: 'dak lak', mode: '63', expectedCode: '66' },
  { q: 'dak nong', mode: '63', expectedCode: '67' },
  { q: 'dak nong', mode: '34', expectedCode: '68' }, // merged into Lam Dong!
  { q: 'Đắk Nông', mode: '34', expectedCode: '68' },
  { q: 'lam dong', mode: '63', expectedCode: '68' },
  { q: 'lam dong', mode: '34', expectedCode: '68' },
  { q: 'binh thuan', mode: '34', expectedCode: '68' }, // merged into Lam Dong!
  { q: 'tphcm', mode: '63', expectedCode: '79' },
  { q: 'sai gon', mode: '63', expectedCode: '79' },
  { q: 'hue', mode: '63', expectedCode: '46' },
  { q: 'thừa thiên huế', mode: '63', expectedCode: '46' },
  { q: 'ba ria vung tau', mode: '63', expectedCode: '77' },
  { q: 'vung tau', mode: '63', expectedCode: '77' },
  { q: 'khanh hoa', mode: '63', expectedCode: '56' },
  { q: 'nha trang', mode: '63', expectedCode: '56' },
  { q: 'thanh hoa', mode: '63', expectedCode: '38' },
  { q: 'da nang', mode: '63', expectedCode: '48' },
  { q: 'ha noi', mode: '63', expectedCode: '01' },
  { q: 'can tho', mode: '63', expectedCode: '92' },
  { q: 'hai phong', mode: '63', expectedCode: '31' },
];

console.log('--- Testing Tricky Queries ---');
let trickyFails = 0;
for (const t of trickyQueries) {
  const res = searchProvinces(t.q, t.mode);
  if (!res.length || res[0].code !== t.expectedCode) {
    console.error(`FAILED tricky query "${t.q}" (mode ${t.mode}): got`, res[0] ? `${res[0].name} (${res[0].code})` : 'EMPTY');
    trickyFails++;
  } else {
    console.log(`PASS: "${t.q}" (${t.mode}) -> ${res[0].displayName} [code ${res[0].code}]`);
  }
}

console.log(`Tricky queries test done. Failures: ${trickyFails}`);
