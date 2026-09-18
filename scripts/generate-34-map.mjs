import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = 'D:/OCOP-Project/full-stack/vietnamese-provinces-database/json/geojson';
const OUTPUT_FILE = path.resolve(__dirname, '../public/maps/vn-34-provinces.geojson');

// 34 Provinces mapping to Regions and Constituent 63 Provinces
const PROVINCES_34_METADATA = {
  '01': {
    name: 'Hà Nội',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['01'],
    constituentNames: ['Hà Nội'],
  },
  '04': {
    name: 'Cao Bằng',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['04'],
    constituentNames: ['Cao Bằng'],
  },
  '08': {
    name: 'Tuyên Quang',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['02', '08'],
    constituentNames: ['Hà Giang', 'Tuyên Quang'],
  },
  '11': {
    name: 'Điện Biên',
    regionId: 2,
    regionName: 'Tây Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['11'],
    constituentNames: ['Điện Biên'],
  },
  '12': {
    name: 'Lai Châu',
    regionId: 2,
    regionName: 'Tây Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['12'],
    constituentNames: ['Lai Châu'],
  },
  '14': {
    name: 'Sơn La',
    regionId: 2,
    regionName: 'Tây Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['14'],
    constituentNames: ['Sơn La'],
  },
  '10': {
    name: 'Lào Cai',
    regionId: 2,
    regionName: 'Tây Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['10', '15'],
    constituentNames: ['Lào Cai', 'Yên Bái'],
  },
  '19': {
    name: 'Thái Nguyên',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['06', '19'],
    constituentNames: ['Bắc Kạn', 'Thái Nguyên'],
  },
  '20': {
    name: 'Lạng Sơn',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['20'],
    constituentNames: ['Lạng Sơn'],
  },
  '22': {
    name: 'Quảng Ninh',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['22'],
    constituentNames: ['Quảng Ninh'],
  },
  '27': {
    name: 'Bắc Ninh',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['24', '27'],
    constituentNames: ['Bắc Giang', 'Bắc Ninh'],
  },
  '25': {
    name: 'Phú Thọ',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['17', '25', '26'],
    constituentNames: ['Hòa Bình', 'Phú Thọ', 'Vĩnh Phúc'],
  },
  '31': {
    name: 'Hải Phòng',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['30', '31'],
    constituentNames: ['Hải Dương', 'Hải Phòng'],
  },
  '33': {
    name: 'Hưng Yên',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['33', '34'],
    constituentNames: ['Hưng Yên', 'Thái Bình'],
  },
  '37': {
    name: 'Ninh Bình',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['35', '36', '37'],
    constituentNames: ['Hà Nam', 'Nam Định', 'Ninh Bình'],
  },
  '38': {
    name: 'Thanh Hoá',
    regionId: 4,
    regionName: 'Bắc Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['38'],
    constituentNames: ['Thanh Hóa'],
  },
  '40': {
    name: 'Nghệ An',
    regionId: 4,
    regionName: 'Bắc Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['40'],
    constituentNames: ['Nghệ An'],
  },
  '42': {
    name: 'Hà Tĩnh',
    regionId: 4,
    regionName: 'Bắc Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['42'],
    constituentNames: ['Hà Tĩnh'],
  },
  '45': {
    name: 'Quảng Trị',
    regionId: 4,
    regionName: 'Bắc Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['44', '45'],
    constituentNames: ['Quảng Bình', 'Quảng Trị'],
  },
  '46': {
    name: 'Huế',
    regionId: 4,
    regionName: 'Bắc Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['46'],
    constituentNames: ['Thừa Thiên Huế'],
  },
  '48': {
    name: 'Đà Nẵng',
    regionId: 5,
    regionName: 'Duyên hải Nam Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['48', '49'],
    constituentNames: ['Đà Nẵng', 'Quảng Nam'],
  },
  '51': {
    name: 'Quảng Ngãi',
    regionId: 5,
    regionName: 'Duyên hải Nam Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['51', '62'],
    constituentNames: ['Quảng Ngãi', 'Kon Tum'],
  },
  '64': {
    name: 'Gia Lai',
    regionId: 6,
    regionName: 'Tây Nguyên',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['52', '64'],
    constituentNames: ['Bình Định', 'Gia Lai'],
  },
  '56': {
    name: 'Khánh Hoà',
    regionId: 5,
    regionName: 'Duyên hải Nam Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['56', '58'],
    constituentNames: ['Khánh Hòa', 'Ninh Thuận'],
  },
  '66': {
    name: 'Đắk Lắk',
    regionId: 6,
    regionName: 'Tây Nguyên',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['54', '66'],
    constituentNames: ['Phú Yên', 'Đắk Lắk'],
  },
  '68': {
    name: 'Lâm Đồng',
    regionId: 6,
    regionName: 'Tây Nguyên',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['60', '67', '68'],
    constituentNames: ['Bình Thuận', 'Đắk Nông', 'Lâm Đồng'],
  },
  '75': {
    name: 'Đồng Nai',
    regionId: 7,
    regionName: 'Đông Nam Bộ',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    constituentCodes: ['70', '75'],
    constituentNames: ['Bình Phước', 'Đồng Nai'],
  },
  '79': {
    name: 'Hồ Chí Minh',
    regionId: 7,
    regionName: 'Đông Nam Bộ',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    constituentCodes: ['74', '77', '79'],
    constituentNames: ['Bình Dương', 'Bà Rịa - Vũng Tàu', 'TP. Hồ Chí Minh'],
  },
  '72': {
    name: 'Tây Ninh',
    regionId: 7,
    regionName: 'Đông Nam Bộ',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    constituentCodes: ['72', '80'],
    constituentNames: ['Tây Ninh', 'Long An'],
  },
  '87': {
    name: 'Đồng Tháp',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    constituentCodes: ['82', '87'],
    constituentNames: ['Tiền Giang', 'Đồng Tháp'],
  },
  '86': {
    name: 'Vĩnh Long',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    constituentCodes: ['83', '84', '86'],
    constituentNames: ['Bến Tre', 'Trà Vinh', 'Vĩnh Long'],
  },
  '89': {
    name: 'An Giang',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    constituentCodes: ['89', '91'],
    constituentNames: ['An Giang', 'Kiên Giang'],
  },
  '92': {
    name: 'Cần Thơ',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    constituentCodes: ['92', '93', '94'],
    constituentNames: ['Cần Thơ', 'Hậu Giang', 'Sóc Trăng'],
  },
  '96': {
    name: 'Cà Mau',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    constituentCodes: ['95', '96'],
    constituentNames: ['Bạc Liêu', 'Cà Mau'],
  },
};

function build34ProvincesGeoJSON() {
  console.log(`Starting to bundle 34 provinces from: ${SOURCE_DIR}`);
  if (!fs.existsSync(SOURCE_DIR)) {
    throw new Error(`Source directory not found: ${SOURCE_DIR}`);
  }

  const entries = fs.readdirSync(SOURCE_DIR, { withFileTypes: true });
  const features = [];
  let minLon = 180;
  let minLat = 90;
  let maxLon = -180;
  let maxLat = -90;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const geojsonPath = path.join(SOURCE_DIR, entry.name, `${entry.name}.geojson`);
    if (!fs.existsSync(geojsonPath)) {
      console.warn(`File not found: ${geojsonPath}`);
      continue;
    }

    const rawData = fs.readFileSync(geojsonPath, 'utf-8');
    const parsed = JSON.parse(rawData);

    if (!parsed.features || parsed.features.length === 0) {
      console.warn(`No features in: ${geojsonPath}`);
      continue;
    }

    const feature = parsed.features[0];
    const rawCode = feature.properties?.code || feature.id || entry.name.split('_')[0];
    const RAW_TO_NORMALIZED_CODE = {
      '15': '10',
      '24': '27',
      '44': '45',
      '52': '64',
      '80': '72',
      '82': '87',
      '91': '89',
    };
    const code = RAW_TO_NORMALIZED_CODE[rawCode] || rawCode;
    feature.id = code;
    const meta = PROVINCES_34_METADATA[code] || {};

    // Calculate bbox bounds
    const bbox = feature.bbox || parsed.bbox;
    if (bbox && bbox.length === 4) {
      minLon = Math.min(minLon, bbox[0]);
      minLat = Math.min(minLat, bbox[1]);
      maxLon = Math.max(maxLon, bbox[2]);
      maxLat = Math.max(maxLat, bbox[3]);
    }

    // Enrich properties
    feature.properties = {
      ...feature.properties,
      code,
      name: meta.name || feature.properties?.name,
      fullName: feature.properties?.fullName || meta.name,
      regionId: meta.regionId,
      regionName: meta.regionName,
      macroRegion: meta.macroRegion,
      macroRegionName: meta.macroRegionName,
      constituentCodes: meta.constituentCodes || [code],
      constituentNames: meta.constituentNames || [meta.name],
    };

    features.push(feature);
  }

  console.log(`Loaded ${features.length} province features.`);

  const collection = {
    type: 'FeatureCollection',
    bbox: [minLon, minLat, maxLon, maxLat],
    features: features.sort((a, b) => a.properties.code.localeCompare(b.properties.code)),
  };

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const jsonString = JSON.stringify(collection);
  fs.writeFileSync(OUTPUT_FILE, jsonString, 'utf-8');

  const sizeMb = (Buffer.byteLength(jsonString) / (1024 * 1024)).toFixed(2);
  console.log(`Successfully generated: ${OUTPUT_FILE} (${sizeMb} MB)`);
}

build34ProvincesGeoJSON();
