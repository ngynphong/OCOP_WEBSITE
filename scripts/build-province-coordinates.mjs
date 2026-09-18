import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const geo63 = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/maps/vn-63-provinces.geojson'), 'utf8'));
const geo34 = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/maps/vn-34-provinces.geojson'), 'utf8'));

const coords63 = {};
for (const f of geo63.features) {
  const p = f.properties;
  coords63[p.code] = {
    code: p.code,
    name: p.name,
    center: [Number(p.center[0].toFixed(4)), Number(p.center[1].toFixed(4))],
    bbox: f.bbox.map(n => Number(n.toFixed(4))),
    regionName: p.regionName,
  };
}

const coords34 = {};
for (const f of geo34.features) {
  const p = f.properties;
  const b = f.bbox;
  let center = [Number(((b[1] + b[3]) / 2).toFixed(4)), Number(((b[0] + b[2]) / 2).toFixed(4))];
  if (p.code === '48') center = [16.0544, 108.2022]; // Da Nang mainland
  if (p.code === '56') center = [12.2585, 109.0526]; // Khanh Hoa mainland
  coords34[p.code] = {
    code: p.code,
    name: p.name,
    center,
    bbox: b.map(n => Number(n.toFixed(4))),
    regionName: p.regionName,
    constituentCodes: p.constituentCodes || [],
    constituentNames: p.constituentNames || [],
  };
}

const fileContent = `/**
 * Bảng toạ độ trung tâm và Bounding Box chuẩn xác cho toàn bộ 63 tỉnh thành và 34 tỉnh thành quy hoạch
 * Hỗ trợ định vị ngay lập tức (0ms) mà không phụ thuộc vào geocoding bên ngoài.
 */
import { ProvinceMode } from './regions-map';

export interface ProvinceGeoData {
  code: string;
  name: string;
  center: [number, number]; // [latitude, longitude]
  bbox: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  regionName?: string;
  constituentCodes?: string[];
  constituentNames?: string[];
}

/** Giới hạn địa lý bản đồ Việt Nam (bao gồm cả vùng biển đảo, Hoàng Sa, Trường Sa) */
export const VIETNAM_MAP_BOUNDS: [[number, number], [number, number]] = [
  [7.0, 101.0],  // Tây Nam
  [24.5, 118.5], // Đông Bắc
];

export const VIETNAM_CENTER: [number, number] = [16.04, 107.5];
export const VIETNAM_DEFAULT_ZOOM = 6;
export const VIETNAM_MIN_ZOOM = 5;
export const VIETNAM_MAX_ZOOM = 19;
export const PROVINCE_FOCUS_ZOOM = 9;

export const PROVINCE_COORDINATES_63: Record<string, ProvinceGeoData> = ${JSON.stringify(coords63, null, 2)};

export const PROVINCE_COORDINATES_34: Record<string, ProvinceGeoData> = ${JSON.stringify(coords34, null, 2)};

/** Chuẩn hóa chuỗi tiếng Việt để so khớp tìm kiếm (loại bỏ dấu, ký tự đặc biệt, lowercase) */
export function normalizeSearchStr(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\\s+/g, ' ')
    .trim();
}

/** Bảng bí danh tên tỉnh/thành phố phổ biến */
const PROVINCE_ALIASES: Record<string, { code63: string; code34: string }> = {
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

/**
 * Tra cứu thông tin toạ độ tỉnh thành theo mã hoặc tên
 */
export function getProvinceGeo(
  identifier: string,
  mode: ProvinceMode = '63'
): ProvinceGeoData | undefined {
  if (!identifier) return undefined;
  const map = mode === '34' ? PROVINCE_COORDINATES_34 : PROVINCE_COORDINATES_63;

  // 1. Tìm theo mã code chính xác
  if (map[identifier]) return map[identifier];

  const normInput = normalizeSearchStr(identifier);
  const compactInput = normInput.replace(/\\s+/g, '');

  // 2. Tra qua bí danh
  const alias = PROVINCE_ALIASES[normInput] || PROVINCE_ALIASES[compactInput];
  if (alias) {
    const code = mode === '34' ? alias.code34 : alias.code63;
    if (map[code]) return map[code];
  }

  // 3. Tìm theo tên tỉnh
  const values = Object.values(map);
  for (const item of values) {
    const normName = normalizeSearchStr(item.name);
    const compactName = normName.replace(/\\s+/g, '');
    if (
      normName === normInput ||
      compactName === compactInput ||
      normName.includes(normInput) ||
      normInput.includes(normName)
    ) {
      return item;
    }
  }

  // 4. Nếu ở chế độ 34 tỉnh, kiểm tra tỉnh cấu thành
  if (mode === '34') {
    for (const item of values) {
      for (const cName of item.constituentNames || []) {
        const normC = normalizeSearchStr(cName);
        if (normC === normInput || normC.includes(normInput) || normInput.includes(normC)) {
          return item;
        }
      }
    }
  }

  return undefined;
}

export interface ProvinceSearchResult {
  code: string;
  name: string;
  displayName: string;
  center: [number, number];
  bbox: [number, number, number, number];
  regionName?: string;
  score: number;
}

/**
 * Tìm kiếm danh sách tỉnh thành khớp với từ khóa nhập vào (Hỗ trợ không dấu, viết tắt, alias, tỉnh cấu thành)
 */
export function searchProvinces(
  query: string,
  mode: ProvinceMode = '63',
  limit: number = 5
): ProvinceSearchResult[] {
  const q = normalizeSearchStr(query);
  if (!q) return [];
  const qCompact = q.replace(/\\s+/g, '');

  const map = mode === '34' ? PROVINCE_COORDINATES_34 : PROVINCE_COORDINATES_63;
  const results: ProvinceSearchResult[] = [];

  // Kiểm tra alias
  const alias = PROVINCE_ALIASES[q] || PROVINCE_ALIASES[qCompact];
  const priorityCode = alias ? (mode === '34' ? alias.code34 : alias.code63) : undefined;

  for (const item of Object.values(map)) {
    const normName = normalizeSearchStr(item.name);
    const compactName = normName.replace(/\\s+/g, '');
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
      // Tìm trong danh sách các tỉnh cấu thành
      for (const cName of item.constituentNames) {
        const normC = normalizeSearchStr(cName);
        const compactC = normC.replace(/\\s+/g, '');
        if (normC === q || compactC === qCompact) {
          score = 75;
          matchLabel = \`\${item.name} (gồm \${cName})\`;
          break;
        } else if (normC.includes(q) || compactC.includes(qCompact)) {
          score = 65;
          matchLabel = \`\${item.name} (gồm \${cName})\`;
          break;
        }
      }
    }

    if (score > 0) {
      results.push({
        code: item.code,
        name: item.name,
        displayName: matchLabel,
        center: item.center,
        bbox: item.bbox,
        regionName: item.regionName,
        score,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
`;

fs.writeFileSync(path.resolve(__dirname, '../src/constants/province-coordinates.ts'), fileContent, 'utf-8');
console.log('Successfully generated src/constants/province-coordinates.ts');
