/**
 * Bản đồ phân loại Vùng Miền và ánh xạ Tỉnh Thành Việt Nam (Dual-mode: 63 tỉnh & 34 tỉnh)
 * Hỗ trợ tra cứu, tô màu và lọc sản phẩm OCOP theo Vùng/Miền.
 */

export type ProvinceMode = '63' | '34';
export type MacroRegionKey = 'all' | 'bac' | 'trung' | 'nam';
export type RegionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface MacroRegion {
  key: MacroRegionKey;
  name: string;
  regionIds: RegionId[];
  color: string;
}

export interface AdministrativeRegion {
  id: RegionId;
  name: string;
  codeName: string;
  macroRegion: 'bac' | 'trung' | 'nam';
  color: string;
}

export interface ProvinceInfo {
  code: string;
  name: string;
  regionId: RegionId;
  regionName: string;
  macroRegion: 'bac' | 'trung' | 'nam';
  macroRegionName: string;
  // Cho chế độ 34 tỉnh: danh sách các tỉnh cũ tương ứng
  constituentCodes?: string[];
  constituentNames?: string[];
  // Cho chế độ 63 tỉnh: tỉnh mới tương ứng trong đề án 34
  parent34Code?: string;
  parent34Name?: string;
}

/**
 * 3 Miền lớn (Bắc - Trung - Nam)
 */
export const MACRO_REGIONS: Record<string, MacroRegion> = {
  all: {
    key: 'all',
    name: 'Toàn quốc',
    regionIds: [1, 2, 3, 4, 5, 6, 7, 8],
    color: '#059669',
  },
  bac: {
    key: 'bac',
    name: 'Miền Bắc',
    regionIds: [1, 2, 3],
    color: '#0284c7', // Sky Blue
  },
  trung: {
    key: 'trung',
    name: 'Miền Trung',
    regionIds: [4, 5, 6],
    color: '#d97706', // Amber
  },
  nam: {
    key: 'nam',
    name: 'Miền Nam',
    regionIds: [7, 8],
    color: '#16a34a', // Green
  },
};

/**
 * 8 Vùng kinh tế - sinh thái theo chuẩn Tổng cục Thống kê (GSO)
 */
export const ADMINISTRATIVE_REGIONS: Record<RegionId, AdministrativeRegion> = {
  1: {
    id: 1,
    name: 'Đông Bắc Bộ',
    codeName: 'dong_bac_bo',
    macroRegion: 'bac',
    color: '#38bdf8', // Light blue
  },
  2: {
    id: 2,
    name: 'Tây Bắc Bộ',
    codeName: 'tay_bac_bo',
    macroRegion: 'bac',
    color: '#818cf8', // Indigo
  },
  3: {
    id: 3,
    name: 'Đồng bằng sông Hồng',
    codeName: 'dong_bang_song_hong',
    macroRegion: 'bac',
    color: '#0284c7', // Cyan / Deep Sky
  },
  4: {
    id: 4,
    name: 'Bắc Trung Bộ',
    codeName: 'bac_trung_bo',
    macroRegion: 'trung',
    color: '#f59e0b', // Amber
  },
  5: {
    id: 5,
    name: 'Duyên hải Nam Trung Bộ',
    codeName: 'duyen_hai_nam_trung_bo',
    macroRegion: 'trung',
    color: '#ea580c', // Orange
  },
  6: {
    id: 6,
    name: 'Tây Nguyên',
    codeName: 'tay_nguyen',
    macroRegion: 'trung',
    color: '#b45309', // Brown-amber
  },
  7: {
    id: 7,
    name: 'Đông Nam Bộ',
    codeName: 'dong_nam_bo',
    macroRegion: 'nam',
    color: '#10b981', // Emerald
  },
  8: {
    id: 8,
    name: 'Đồng bằng sông Cửu Long',
    codeName: 'dong_bang_song_cuu_long',
    macroRegion: 'nam',
    color: '#059669', // Deep green
  },
};

/**
 * Danh mục 34 Tỉnh Thành (Quy hoạch sáp nhập mới theo NĐ 36/2026/QH16)
 */
export const PROVINCES_34_MAP: Record<string, ProvinceInfo> = {
  '01': {
    code: '01',
    name: 'Hà Nội',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['01'],
    constituentNames: ['Hà Nội'],
  },
  '04': {
    code: '04',
    name: 'Cao Bằng',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['04'],
    constituentNames: ['Cao Bằng'],
  },
  '08': {
    code: '08',
    name: 'Tuyên Quang',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['02', '08'],
    constituentNames: ['Hà Giang', 'Tuyên Quang'],
  },
  '11': {
    code: '11',
    name: 'Điện Biên',
    regionId: 2,
    regionName: 'Tây Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['11'],
    constituentNames: ['Điện Biên'],
  },
  '12': {
    code: '12',
    name: 'Lai Châu',
    regionId: 2,
    regionName: 'Tây Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['12'],
    constituentNames: ['Lai Châu'],
  },
  '14': {
    code: '14',
    name: 'Sơn La',
    regionId: 2,
    regionName: 'Tây Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['14'],
    constituentNames: ['Sơn La'],
  },
  '10': {
    code: '10',
    name: 'Lào Cai',
    regionId: 2,
    regionName: 'Tây Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['10', '15'],
    constituentNames: ['Lào Cai', 'Yên Bái'],
  },
  '19': {
    code: '19',
    name: 'Thái Nguyên',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['06', '19'],
    constituentNames: ['Bắc Kạn', 'Thái Nguyên'],
  },
  '20': {
    code: '20',
    name: 'Lạng Sơn',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['20'],
    constituentNames: ['Lạng Sơn'],
  },
  '22': {
    code: '22',
    name: 'Quảng Ninh',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['22'],
    constituentNames: ['Quảng Ninh'],
  },
  '27': {
    code: '27',
    name: 'Bắc Ninh',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['24', '27'],
    constituentNames: ['Bắc Giang', 'Bắc Ninh'],
  },
  '25': {
    code: '25',
    name: 'Phú Thọ',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['17', '25', '26'],
    constituentNames: ['Hòa Bình', 'Phú Thọ', 'Vĩnh Phúc'],
  },
  '31': {
    code: '31',
    name: 'Hải Phòng',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['30', '31'],
    constituentNames: ['Hải Dương', 'Hải Phòng'],
  },
  '33': {
    code: '33',
    name: 'Hưng Yên',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['33', '34'],
    constituentNames: ['Hưng Yên', 'Thái Bình'],
  },
  '37': {
    code: '37',
    name: 'Ninh Bình',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    constituentCodes: ['35', '36', '37'],
    constituentNames: ['Hà Nam', 'Nam Định', 'Ninh Bình'],
  },
  '38': {
    code: '38',
    name: 'Thanh Hoá',
    regionId: 4,
    regionName: 'Bắc Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['38'],
    constituentNames: ['Thanh Hóa'],
  },
  '40': {
    code: '40',
    name: 'Nghệ An',
    regionId: 4,
    regionName: 'Bắc Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['40'],
    constituentNames: ['Nghệ An'],
  },
  '42': {
    code: '42',
    name: 'Hà Tĩnh',
    regionId: 4,
    regionName: 'Bắc Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['42'],
    constituentNames: ['Hà Tĩnh'],
  },
  '45': {
    code: '45',
    name: 'Quảng Trị',
    regionId: 4,
    regionName: 'Bắc Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['44', '45'],
    constituentNames: ['Quảng Bình', 'Quảng Trị'],
  },
  '46': {
    code: '46',
    name: 'Huế',
    regionId: 4,
    regionName: 'Bắc Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['46'],
    constituentNames: ['Thừa Thiên Huế'],
  },
  '48': {
    code: '48',
    name: 'Đà Nẵng',
    regionId: 5,
    regionName: 'Duyên hải Nam Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['48', '49'],
    constituentNames: ['Đà Nẵng', 'Quảng Nam'],
  },
  '51': {
    code: '51',
    name: 'Quảng Ngãi',
    regionId: 5,
    regionName: 'Duyên hải Nam Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['51', '62'],
    constituentNames: ['Quảng Ngãi', 'Kon Tum'],
  },
  '64': {
    code: '64',
    name: 'Gia Lai',
    regionId: 6,
    regionName: 'Tây Nguyên',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['52', '64'],
    constituentNames: ['Bình Định', 'Gia Lai'],
  },
  '56': {
    code: '56',
    name: 'Khánh Hoà',
    regionId: 5,
    regionName: 'Duyên hải Nam Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['56', '58'],
    constituentNames: ['Khánh Hòa', 'Ninh Thuận'],
  },
  '66': {
    code: '66',
    name: 'Đắk Lắk',
    regionId: 6,
    regionName: 'Tây Nguyên',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['54', '66'],
    constituentNames: ['Phú Yên', 'Đắk Lắk'],
  },
  '68': {
    code: '68',
    name: 'Lâm Đồng',
    regionId: 6,
    regionName: 'Tây Nguyên',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    constituentCodes: ['60', '67', '68'],
    constituentNames: ['Bình Thuận', 'Đắk Nông', 'Lâm Đồng'],
  },
  '75': {
    code: '75',
    name: 'Đồng Nai',
    regionId: 7,
    regionName: 'Đông Nam Bộ',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    constituentCodes: ['70', '75'],
    constituentNames: ['Bình Phước', 'Đồng Nai'],
  },
  '79': {
    code: '79',
    name: 'Hồ Chí Minh',
    regionId: 7,
    regionName: 'Đông Nam Bộ',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    constituentCodes: ['74', '77', '79'],
    constituentNames: ['Bình Dương', 'Bà Rịa - Vũng Tàu', 'TP. Hồ Chí Minh'],
  },
  '72': {
    code: '72',
    name: 'Tây Ninh',
    regionId: 7,
    regionName: 'Đông Nam Bộ',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    constituentCodes: ['72', '80'],
    constituentNames: ['Tây Ninh', 'Long An'],
  },
  '87': {
    code: '87',
    name: 'Đồng Tháp',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    constituentCodes: ['82', '87'],
    constituentNames: ['Tiền Giang', 'Đồng Tháp'],
  },
  '86': {
    code: '86',
    name: 'Vĩnh Long',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    constituentCodes: ['83', '84', '86'],
    constituentNames: ['Bến Tre', 'Trà Vinh', 'Vĩnh Long'],
  },
  '89': {
    code: '89',
    name: 'An Giang',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    constituentCodes: ['89', '91'],
    constituentNames: ['An Giang', 'Kiên Giang'],
  },
  '92': {
    code: '92',
    name: 'Cần Thơ',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    constituentCodes: ['92', '93', '94'],
    constituentNames: ['Cần Thơ', 'Hậu Giang', 'Sóc Trăng'],
  },
  '96': {
    code: '96',
    name: 'Cà Mau',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    constituentCodes: ['95', '96'],
    constituentNames: ['Bạc Liêu', 'Cà Mau'],
  },
};

/**
 * Danh mục 63 Tỉnh Thành truyền thống (kèm thông tin Vùng và Tỉnh 34 tương ứng)
 */
export const PROVINCES_63_MAP: Record<string, ProvinceInfo> = {
  // Miền Bắc - Vùng 1: Đông Bắc Bộ
  '02': {
    code: '02',
    name: 'Hà Giang',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '08',
    parent34Name: 'Tuyên Quang',
  },
  '04': {
    code: '04',
    name: 'Cao Bằng',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '04',
    parent34Name: 'Cao Bằng',
  },
  '06': {
    code: '06',
    name: 'Bắc Kạn',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '19',
    parent34Name: 'Thái Nguyên',
  },
  '08': {
    code: '08',
    name: 'Tuyên Quang',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '08',
    parent34Name: 'Tuyên Quang',
  },
  '19': {
    code: '19',
    name: 'Thái Nguyên',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '19',
    parent34Name: 'Thái Nguyên',
  },
  '20': {
    code: '20',
    name: 'Lạng Sơn',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '20',
    parent34Name: 'Lạng Sơn',
  },
  '22': {
    code: '22',
    name: 'Quảng Ninh',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '22',
    parent34Name: 'Quảng Ninh',
  },
  '24': {
    code: '24',
    name: 'Bắc Giang',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '27',
    parent34Name: 'Bắc Ninh',
  },
  '25': {
    code: '25',
    name: 'Phú Thọ',
    regionId: 1,
    regionName: 'Đông Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '25',
    parent34Name: 'Phú Thọ',
  },

  // Miền Bắc - Vùng 2: Tây Bắc Bộ
  '10': {
    code: '10',
    name: 'Lào Cai',
    regionId: 2,
    regionName: 'Tây Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '10',
    parent34Name: 'Lào Cai',
  },
  '11': {
    code: '11',
    name: 'Điện Biên',
    regionId: 2,
    regionName: 'Tây Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '11',
    parent34Name: 'Điện Biên',
  },
  '12': {
    code: '12',
    name: 'Lai Châu',
    regionId: 2,
    regionName: 'Tây Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '12',
    parent34Name: 'Lai Châu',
  },
  '14': {
    code: '14',
    name: 'Sơn La',
    regionId: 2,
    regionName: 'Tây Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '14',
    parent34Name: 'Sơn La',
  },
  '15': {
    code: '15',
    name: 'Yên Bái',
    regionId: 2,
    regionName: 'Tây Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '10',
    parent34Name: 'Lào Cai',
  },
  '17': {
    code: '17',
    name: 'Hòa Bình',
    regionId: 2,
    regionName: 'Tây Bắc Bộ',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '25',
    parent34Name: 'Phú Thọ',
  },

  // Miền Bắc - Vùng 3: Đồng bằng sông Hồng
  '01': {
    code: '01',
    name: 'Hà Nội',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '01',
    parent34Name: 'Hà Nội',
  },
  '26': {
    code: '26',
    name: 'Vĩnh Phúc',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '25',
    parent34Name: 'Phú Thọ',
  },
  '27': {
    code: '27',
    name: 'Bắc Ninh',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '27',
    parent34Name: 'Bắc Ninh',
  },
  '30': {
    code: '30',
    name: 'Hải Dương',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '31',
    parent34Name: 'Hải Phòng',
  },
  '31': {
    code: '31',
    name: 'Hải Phòng',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '31',
    parent34Name: 'Hải Phòng',
  },
  '33': {
    code: '33',
    name: 'Hưng Yên',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '33',
    parent34Name: 'Hưng Yên',
  },
  '34': {
    code: '34',
    name: 'Thái Bình',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '33',
    parent34Name: 'Hưng Yên',
  },
  '35': {
    code: '35',
    name: 'Hà Nam',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '37',
    parent34Name: 'Ninh Bình',
  },
  '36': {
    code: '36',
    name: 'Nam Định',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '37',
    parent34Name: 'Ninh Bình',
  },
  '37': {
    code: '37',
    name: 'Ninh Bình',
    regionId: 3,
    regionName: 'Đồng bằng sông Hồng',
    macroRegion: 'bac',
    macroRegionName: 'Miền Bắc',
    parent34Code: '37',
    parent34Name: 'Ninh Bình',
  },

  // Miền Trung - Vùng 4: Bắc Trung Bộ
  '38': {
    code: '38',
    name: 'Thanh Hóa',
    regionId: 4,
    regionName: 'Bắc Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '38',
    parent34Name: 'Thanh Hoá',
  },
  '40': {
    code: '40',
    name: 'Nghệ An',
    regionId: 4,
    regionName: 'Bắc Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '40',
    parent34Name: 'Nghệ An',
  },
  '42': {
    code: '42',
    name: 'Hà Tĩnh',
    regionId: 4,
    regionName: 'Bắc Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '42',
    parent34Name: 'Hà Tĩnh',
  },
  '44': {
    code: '44',
    name: 'Quảng Bình',
    regionId: 4,
    regionName: 'Bắc Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '45',
    parent34Name: 'Quảng Trị',
  },
  '45': {
    code: '45',
    name: 'Quảng Trị',
    regionId: 4,
    regionName: 'Bắc Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '45',
    parent34Name: 'Quảng Trị',
  },
  '46': {
    code: '46',
    name: 'Thừa Thiên Huế',
    regionId: 4,
    regionName: 'Bắc Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '46',
    parent34Name: 'Huế',
  },

  // Miền Trung - Vùng 5: Duyên hải Nam Trung Bộ
  '48': {
    code: '48',
    name: 'Đà Nẵng',
    regionId: 5,
    regionName: 'Duyên hải Nam Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '48',
    parent34Name: 'Đà Nẵng',
  },
  '49': {
    code: '49',
    name: 'Quảng Nam',
    regionId: 5,
    regionName: 'Duyên hải Nam Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '48',
    parent34Name: 'Đà Nẵng',
  },
  '51': {
    code: '51',
    name: 'Quảng Ngãi',
    regionId: 5,
    regionName: 'Duyên hải Nam Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '51',
    parent34Name: 'Quảng Ngãi',
  },
  '52': {
    code: '52',
    name: 'Bình Định',
    regionId: 5,
    regionName: 'Duyên hải Nam Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '64',
    parent34Name: 'Gia Lai',
  },
  '54': {
    code: '54',
    name: 'Phú Yên',
    regionId: 5,
    regionName: 'Duyên hải Nam Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '66',
    parent34Name: 'Đắk Lắk',
  },
  '56': {
    code: '56',
    name: 'Khánh Hòa',
    regionId: 5,
    regionName: 'Duyên hải Nam Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '56',
    parent34Name: 'Khánh Hoà',
  },
  '58': {
    code: '58',
    name: 'Ninh Thuận',
    regionId: 5,
    regionName: 'Duyên hải Nam Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '56',
    parent34Name: 'Khánh Hoà',
  },
  '60': {
    code: '60',
    name: 'Bình Thuận',
    regionId: 5,
    regionName: 'Duyên hải Nam Trung Bộ',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '68',
    parent34Name: 'Lâm Đồng',
  },

  // Miền Trung - Vùng 6: Tây Nguyên
  '62': {
    code: '62',
    name: 'Kon Tum',
    regionId: 6,
    regionName: 'Tây Nguyên',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '51',
    parent34Name: 'Quảng Ngãi',
  },
  '64': {
    code: '64',
    name: 'Gia Lai',
    regionId: 6,
    regionName: 'Tây Nguyên',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '64',
    parent34Name: 'Gia Lai',
  },
  '66': {
    code: '66',
    name: 'Đắk Lắk',
    regionId: 6,
    regionName: 'Tây Nguyên',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '66',
    parent34Name: 'Đắk Lắk',
  },
  '67': {
    code: '67',
    name: 'Đắk Nông',
    regionId: 6,
    regionName: 'Tây Nguyên',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '68',
    parent34Name: 'Lâm Đồng',
  },
  '68': {
    code: '68',
    name: 'Lâm Đồng',
    regionId: 6,
    regionName: 'Tây Nguyên',
    macroRegion: 'trung',
    macroRegionName: 'Miền Trung',
    parent34Code: '68',
    parent34Name: 'Lâm Đồng',
  },

  // Miền Nam - Vùng 7: Đông Nam Bộ
  '70': {
    code: '70',
    name: 'Bình Phước',
    regionId: 7,
    regionName: 'Đông Nam Bộ',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '75',
    parent34Name: 'Đồng Nai',
  },
  '72': {
    code: '72',
    name: 'Tây Ninh',
    regionId: 7,
    regionName: 'Đông Nam Bộ',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '72',
    parent34Name: 'Tây Ninh',
  },
  '74': {
    code: '74',
    name: 'Bình Dương',
    regionId: 7,
    regionName: 'Đông Nam Bộ',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '79',
    parent34Name: 'Hồ Chí Minh',
  },
  '75': {
    code: '75',
    name: 'Đồng Nai',
    regionId: 7,
    regionName: 'Đông Nam Bộ',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '75',
    parent34Name: 'Đồng Nai',
  },
  '77': {
    code: '77',
    name: 'Bà Rịa - Vũng Tàu',
    regionId: 7,
    regionName: 'Đông Nam Bộ',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '79',
    parent34Name: 'Hồ Chí Minh',
  },
  '79': {
    code: '79',
    name: 'TP. Hồ Chí Minh',
    regionId: 7,
    regionName: 'Đông Nam Bộ',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '79',
    parent34Name: 'Hồ Chí Minh',
  },

  // Miền Nam - Vùng 8: Đồng bằng sông Cửu Long
  '80': {
    code: '80',
    name: 'Long An',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '72',
    parent34Name: 'Tây Ninh',
  },
  '82': {
    code: '82',
    name: 'Tiền Giang',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '87',
    parent34Name: 'Đồng Tháp',
  },
  '83': {
    code: '83',
    name: 'Bến Tre',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '86',
    parent34Name: 'Vĩnh Long',
  },
  '84': {
    code: '84',
    name: 'Trà Vinh',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '86',
    parent34Name: 'Vĩnh Long',
  },
  '86': {
    code: '86',
    name: 'Vĩnh Long',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '86',
    parent34Name: 'Vĩnh Long',
  },
  '87': {
    code: '87',
    name: 'Đồng Tháp',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '87',
    parent34Name: 'Đồng Tháp',
  },
  '89': {
    code: '89',
    name: 'An Giang',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '89',
    parent34Name: 'An Giang',
  },
  '91': {
    code: '91',
    name: 'Kiên Giang',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '89',
    parent34Name: 'An Giang',
  },
  '92': {
    code: '92',
    name: 'Cần Thơ',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '92',
    parent34Name: 'Cần Thơ',
  },
  '93': {
    code: '93',
    name: 'Hậu Giang',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '92',
    parent34Name: 'Cần Thơ',
  },
  '94': {
    code: '94',
    name: 'Sóc Trăng',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '92',
    parent34Name: 'Cần Thơ',
  },
  '95': {
    code: '95',
    name: 'Bạc Liêu',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '96',
    parent34Name: 'Cà Mau',
  },
  '96': {
    code: '96',
    name: 'Cà Mau',
    regionId: 8,
    regionName: 'Đồng bằng sông Cửu Long',
    macroRegion: 'nam',
    macroRegionName: 'Miền Nam',
    parent34Code: '96',
    parent34Name: 'Cà Mau',
  },
};

/**
 * Chuẩn hóa chuỗi tiếng Việt để so sánh tên tỉnh linh hoạt (bỏ dấu, lowercase, trim)
 */
export function normalizeVietnamese(str: string): string {
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

/**
 * Tìm thông tin tỉnh theo tên hoặc mã code
 */
export function findProvince(
  identifier: string,
  mode: ProvinceMode = '63',
): ProvinceInfo | undefined {
  if (!identifier) return undefined;
  const map = mode === '34' ? PROVINCES_34_MAP : PROVINCES_63_MAP;

  // Tìm trực tiếp theo code
  if (map[identifier]) return map[identifier];

  // Tìm theo tên chuẩn hóa
  const normInput = normalizeVietnamese(identifier);
  const values = Object.values(map);

  return values.find((item) => {
    const normName = normalizeVietnamese(item.name);
    return normName === normInput || normName.includes(normInput) || normInput.includes(normName);
  });
}

/**
 * Lấy danh sách tên các tỉnh cũ (63) tương ứng khi chọn 1 tỉnh ở chế độ 34
 * Hỗ trợ query sản phẩm OCOP mà không làm đứt gãy DB cũ.
 */
export function getConstituentProvinces(province34NameOrCode: string): string[] {
  const p = findProvince(province34NameOrCode, '34');
  if (!p) return [province34NameOrCode];
  return p.constituentNames || [p.name];
}

/**
 * Lấy màu tương ứng cho tỉnh dựa theo Region ID
 */
export function getRegionColor(regionId: RegionId): string {
  return ADMINISTRATIVE_REGIONS[regionId]?.color || '#10b981';
}

/**
 * Kiểm tra tỉnh có thuộc vùng/miền đang lọc không
 */
export function isProvinceInRegion(
  provinceNameOrCode: string,
  macroRegion: MacroRegionKey,
  selectedRegionId: RegionId | 'all',
  mode: ProvinceMode = '63',
): boolean {
  if (macroRegion === 'all' && selectedRegionId === 'all') return true;

  const p = findProvince(provinceNameOrCode, mode);
  if (!p) return false;

  // Lọc theo Vùng cụ thể (1-8)
  if (selectedRegionId !== 'all') {
    return p.regionId === selectedRegionId;
  }

  // Lọc theo Miền lớn (Bắc - Trung - Nam)
  if (macroRegion !== 'all') {
    return p.macroRegion === macroRegion;
  }

  return true;
}
