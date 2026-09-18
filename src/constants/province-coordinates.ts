/**
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
  [7.0, 101.0], // Tây Nam
  [24.5, 118.5], // Đông Bắc
];

export const VIETNAM_CENTER: [number, number] = [16.04, 107.5];
export const VIETNAM_DEFAULT_ZOOM = 6;
export const VIETNAM_MIN_ZOOM = 6;
export const VIETNAM_MAX_ZOOM = 19;
export const PROVINCE_FOCUS_ZOOM = 9;

export const PROVINCE_COORDINATES_63: Record<string, ProvinceGeoData> = {
  '10': {
    code: '10',
    name: 'Lào Cai',
    center: [22.3559, 104.096],
    bbox: [103.5442, 21.7088, 104.6457, 22.8245],
    regionName: 'Tây Bắc Bộ',
  },
  '11': {
    code: '11',
    name: 'Điện Biên',
    center: [21.7487, 103.226],
    bbox: [102.1187, 20.8267, 103.5692, 22.5759],
    regionName: 'Tây Bắc Bộ',
  },
  '12': {
    code: '12',
    name: 'Lai Châu',
    center: [22.3502, 103.255],
    bbox: [102.3249, 21.8875, 103.8011, 22.7874],
    regionName: 'Tây Bắc Bộ',
  },
  '14': {
    code: '14',
    name: 'Sơn La',
    center: [21.3011, 104.159],
    bbox: [103.2265, 20.5753, 105.0869, 22.042],
    regionName: 'Tây Bắc Bộ',
  },
  '15': {
    code: '15',
    name: 'Yên Bái',
    center: [21.7484, 104.512],
    bbox: [103.9135, 21.3294, 105.1123, 22.2644],
    regionName: 'Tây Bắc Bộ',
  },
  '17': {
    code: '17',
    name: 'Hòa Bình',
    center: [20.7292, 105.34],
    bbox: [104.8391, 20.3205, 105.8417, 21.1018],
    regionName: 'Tây Bắc Bộ',
  },
  '19': {
    code: '19',
    name: 'Thái Nguyên',
    center: [21.5812, 105.887],
    bbox: [105.5177, 21.3283, 106.2557, 22.03],
    regionName: 'Đông Bắc Bộ',
  },
  '20': {
    code: '20',
    name: 'Lạng Sơn',
    center: [21.7826, 106.724],
    bbox: [106.1134, 21.3604, 107.3337, 22.4409],
    regionName: 'Đông Bắc Bộ',
  },
  '22': {
    code: '22',
    name: 'Quảng Ninh',
    center: [21.223, 107.181],
    bbox: [106.4411, 20.7038, 107.998, 21.6571],
    regionName: 'Đông Bắc Bộ',
  },
  '24': {
    code: '24',
    name: 'Bắc Giang',
    center: [21.3512, 106.493],
    bbox: [105.921, 21.1336, 107.0649, 21.6328],
    regionName: 'Đông Bắc Bộ',
  },
  '25': {
    code: '25',
    name: 'Phú Thọ',
    center: [21.3127, 105.143],
    bbox: [104.8282, 20.9161, 105.4582, 21.7044],
    regionName: 'Đông Bắc Bộ',
  },
  '26': {
    code: '26',
    name: 'Vĩnh Phúc',
    center: [21.3455, 105.549],
    bbox: [105.3176, 21.1055, 105.7805, 21.5439],
    regionName: 'Đồng bằng sông Hồng',
  },
  '27': {
    code: '27',
    name: 'Bắc Ninh',
    center: [21.098, 106.117],
    bbox: [105.9172, 20.9856, 106.3145, 21.2477],
    regionName: 'Đồng bằng sông Hồng',
  },
  '30': {
    code: '30',
    name: 'Hải Dương',
    center: [20.9613, 106.364],
    bbox: [106.1224, 20.6963, 106.6059, 21.2332],
    regionName: 'Đồng bằng sông Hồng',
  },
  '31': {
    code: '31',
    name: 'Hải Phòng',
    center: [20.79, 106.635],
    bbox: [106.4172, 20.6006, 106.8064, 21.026],
    regionName: 'Đồng bằng sông Hồng',
  },
  '33': {
    code: '33',
    name: 'Hưng Yên',
    center: [20.8085, 106.076],
    bbox: [105.8966, 20.6172, 106.2576, 21.0016],
    regionName: 'Đồng bằng sông Hồng',
  },
  '34': {
    code: '34',
    name: 'Thái Bình',
    center: [20.5303, 106.371],
    bbox: [106.1123, 20.2643, 106.6276, 20.7196],
    regionName: 'Đồng bằng sông Hồng',
  },
  '35': {
    code: '35',
    name: 'Hà Nam',
    center: [20.5569, 105.985],
    bbox: [105.7861, 20.337, 106.185, 20.713],
    regionName: 'Đồng bằng sông Hồng',
  },
  '36': {
    code: '36',
    name: 'Nam Định',
    center: [20.2343, 106.254],
    bbox: [105.9511, 19.9652, 106.5701, 20.491],
    regionName: 'Đồng bằng sông Hồng',
  },
  '37': {
    code: '37',
    name: 'Ninh Bình',
    center: [20.2722, 105.852],
    bbox: [105.5422, 19.9654, 106.1555, 20.4415],
    regionName: 'Đồng bằng sông Hồng',
  },
  '38': {
    code: '38',
    name: 'Thanh Hóa',
    center: [20.0917, 105.215],
    bbox: [104.3591, 19.2742, 106.0705, 20.6432],
    regionName: 'Bắc Trung Bộ',
  },
  '40': {
    code: '40',
    name: 'Nghệ An',
    center: [19.3548, 104.827],
    bbox: [103.8481, 18.5697, 105.8055, 19.9919],
    regionName: 'Bắc Trung Bộ',
  },
  '42': {
    code: '42',
    name: 'Hà Tĩnh',
    center: [18.3563, 105.799],
    bbox: [105.08, 17.9095, 106.5189, 18.7562],
    regionName: 'Bắc Trung Bộ',
  },
  '44': {
    code: '44',
    name: 'Quảng Bình',
    center: [17.4691, 106.357],
    bbox: [105.5939, 16.9502, 107.0073, 18.0709],
    regionName: 'Bắc Trung Bộ',
  },
  '45': {
    code: '45',
    name: 'Quảng Trị',
    center: [16.7204, 106.973],
    bbox: [106.5332, 16.2911, 107.4118, 17.1615],
    regionName: 'Bắc Trung Bộ',
  },
  '46': {
    code: '46',
    name: 'Thừa Thiên Huế',
    center: [16.312, 107.634],
    bbox: [107.0622, 16.0166, 108.2006, 16.7496],
    regionName: 'Bắc Trung Bộ',
  },
  '48': {
    code: '48',
    name: 'Đà Nẵng',
    center: [16.0912, 108.102],
    bbox: [107.8561, 15.9256, 108.5423, 16.2208],
    regionName: 'Duyên hải Nam Trung Bộ',
  },
  '49': {
    code: '49',
    name: 'Quảng Nam',
    center: [15.6535, 107.955],
    bbox: [107.1495, 14.9564, 108.762, 16.091],
    regionName: 'Duyên hải Nam Trung Bộ',
  },
  '51': {
    code: '51',
    name: 'Quảng Ngãi',
    center: [14.9971, 108.686],
    bbox: [108.2757, 14.5958, 109.0947, 15.4292],
    regionName: 'Duyên hải Nam Trung Bộ',
  },
  '52': {
    code: '52',
    name: 'Bình Định',
    center: [14.1075, 108.971],
    bbox: [108.6342, 13.5379, 109.3075, 14.6834],
    regionName: 'Duyên hải Nam Trung Bộ',
  },
  '54': {
    code: '54',
    name: 'Phú Yên',
    center: [13.1647, 109.064],
    bbox: [108.6614, 12.7531, 109.4652, 13.6987],
    regionName: 'Duyên hải Nam Trung Bộ',
  },
  '56': {
    code: '56',
    name: 'Khánh Hòa',
    center: [12.6049, 109.359],
    bbox: [108.6661, 11.7881, 109.4717, 12.8534],
    regionName: 'Duyên hải Nam Trung Bộ',
  },
  '58': {
    code: '58',
    name: 'Ninh Thuận',
    center: [11.6242, 108.925],
    bbox: [108.6095, 11.3097, 109.2436, 12.1817],
    regionName: 'Duyên hải Nam Trung Bộ',
  },
  '60': {
    code: '60',
    name: 'Bình Thuận',
    center: [11.1284, 108.232],
    bbox: [107.4306, 10.5037, 108.966, 11.5646],
    regionName: 'Duyên hải Nam Trung Bộ',
  },
  '62': {
    code: '62',
    name: 'Kon Tum',
    center: [14.7451, 107.969],
    bbox: [107.3201, 13.922, 108.6187, 15.4037],
    regionName: 'Tây Nguyên',
  },
  '64': {
    code: '64',
    name: 'Gia Lai',
    center: [13.8493, 108.156],
    bbox: [107.4348, 12.9956, 108.8745, 14.6401],
    regionName: 'Tây Nguyên',
  },
  '66': {
    code: '66',
    name: 'Đắk Lắk',
    center: [12.7691, 108.133],
    bbox: [107.461, 12.1523, 109.0366, 13.3843],
    regionName: 'Tây Nguyên',
  },
  '67': {
    code: '67',
    name: 'Đắk Nông',
    center: [12.1425, 107.66],
    bbox: [107.2282, 11.7446, 108.128, 12.721],
    regionName: 'Tây Nguyên',
  },
  '68': {
    code: '68',
    name: 'Lâm Đồng',
    center: [11.5362, 108],
    bbox: [107.2821, 11.2113, 108.7191, 12.3034],
    regionName: 'Tây Nguyên',
  },
  '70': {
    code: '70',
    name: 'Bình Phước',
    center: [11.6805, 106.897],
    bbox: [106.3941, 11.2832, 107.401, 12.3109],
    regionName: 'Đông Nam Bộ',
  },
  '72': {
    code: '72',
    name: 'Tây Ninh',
    center: [11.4121, 106.14],
    bbox: [105.7902, 10.9612, 106.4889, 11.771],
    regionName: 'Đông Nam Bộ',
  },
  '74': {
    code: '74',
    name: 'Bình Dương',
    center: [11.1382, 106.659],
    bbox: [106.3426, 10.8741, 106.9742, 11.5535],
    regionName: 'Đông Nam Bộ',
  },
  '75': {
    code: '75',
    name: 'Đồng Nai',
    center: [11.1258, 107.178],
    bbox: [106.754, 10.567, 107.6102, 11.5658],
    regionName: 'Đông Nam Bộ',
  },
  '77': {
    code: '77',
    name: 'Bà Rịa - Vũng Tàu',
    center: [10.3969, 107.143],
    bbox: [106.9913, 10.3236, 107.5867, 10.8009],
    regionName: 'Đông Nam Bộ',
  },
  '79': {
    code: '79',
    name: 'TP. Hồ Chí Minh',
    center: [10.409, 106.926],
    bbox: [106.3631, 10.3712, 107.0253, 11.1358],
    regionName: 'Đông Nam Bộ',
  },
  '80': {
    code: '80',
    name: 'Long An',
    center: [10.6869, 106.134],
    bbox: [105.5233, 10.4138, 106.7444, 11.0249],
    regionName: 'Đồng bằng sông Cửu Long',
  },
  '82': {
    code: '82',
    name: 'Tiền Giang',
    center: [10.4581, 106.217],
    bbox: [105.8393, 10.2288, 106.7954, 10.5929],
    regionName: 'Đồng bằng sông Cửu Long',
  },
  '83': {
    code: '83',
    name: 'Bến Tre',
    center: [10.171, 106.496],
    bbox: [105.9549, 9.8174, 106.7973, 10.3371],
    regionName: 'Đồng bằng sông Cửu Long',
  },
  '84': {
    code: '84',
    name: 'Trà Vinh',
    center: [9.8282, 106.289],
    bbox: [105.9964, 9.5414, 106.576, 10.0769],
    regionName: 'Đồng bằng sông Cửu Long',
  },
  '86': {
    code: '86',
    name: 'Vĩnh Long',
    center: [10.1042, 105.969],
    bbox: [105.6927, 9.888, 106.2462, 10.3019],
    regionName: 'Đồng bằng sông Cửu Long',
  },
  '87': {
    code: '87',
    name: 'Đồng Tháp',
    center: [10.6644, 105.586],
    bbox: [105.2098, 10.3019, 105.9626, 10.9633],
    regionName: 'Đồng bằng sông Cửu Long',
  },
  '89': {
    code: '89',
    name: 'An Giang',
    center: [10.5736, 105.154],
    bbox: [104.7241, 10.1992, 105.5832, 10.9472],
    regionName: 'Đồng bằng sông Cửu Long',
  },
  '91': {
    code: '91',
    name: 'Kiên Giang',
    center: [9.8596, 105.284],
    bbox: [103.8463, 9.4062, 105.5285, 10.5335],
    regionName: 'Đồng bằng sông Cửu Long',
  },
  '92': {
    code: '92',
    name: 'Cần Thơ',
    center: [10.2421, 105.685],
    bbox: [105.241, 10.0435, 105.9106, 10.4472],
    regionName: 'Đồng bằng sông Cửu Long',
  },
  '93': {
    code: '93',
    name: 'Hậu Giang',
    center: [9.8435, 105.663],
    bbox: [105.3617, 9.5863, 105.9015, 10.1235],
    regionName: 'Đồng bằng sông Cửu Long',
  },
  '94': {
    code: '94',
    name: 'Sóc Trăng',
    center: [9.5614, 105.9],
    bbox: [105.5693, 8.6524, 106.6694, 9.917],
    regionName: 'Đồng bằng sông Cửu Long',
  },
  '95': {
    code: '95',
    name: 'Bạc Liêu',
    center: [9.3394, 105.573],
    bbox: [105.2803, 9.0076, 105.8682, 9.6106],
    regionName: 'Đồng bằng sông Cửu Long',
  },
  '96': {
    code: '96',
    name: 'Cà Mau',
    center: [9.0555, 105.073],
    bbox: [104.7202, 8.5656, 105.4255, 9.5346],
    regionName: 'Đồng bằng sông Cửu Long',
  },
  '01': {
    code: '01',
    name: 'Hà Nội',
    center: [21.1306, 105.872],
    bbox: [105.2846, 20.5682, 106.0107, 21.3641],
    regionName: 'Đồng bằng sông Hồng',
  },
  '02': {
    code: '02',
    name: 'Hà Giang',
    center: [22.7655, 104.965],
    bbox: [104.3623, 22.1706, 105.5681, 23.3658],
    regionName: 'Đông Bắc Bộ',
  },
  '04': {
    code: '04',
    name: 'Cao Bằng',
    center: [22.7595, 106.047],
    bbox: [105.3015, 22.3786, 106.7916, 23.0994],
    regionName: 'Đông Bắc Bộ',
  },
  '06': {
    code: '06',
    name: 'Bắc Kạn',
    center: [22.1476, 105.874],
    bbox: [105.4887, 21.7883, 106.2594, 22.7238],
    regionName: 'Đông Bắc Bộ',
  },
  '08': {
    code: '08',
    name: 'Tuyên Quang',
    center: [22.131, 105.229],
    bbox: [104.8477, 21.4953, 105.6086, 22.6476],
    regionName: 'Đông Bắc Bộ',
  },
};

export const PROVINCE_COORDINATES_34: Record<string, ProvinceGeoData> = {
  '10': {
    code: '10',
    name: 'Lào Cai',
    center: [22.087, 104.313],
    bbox: [103.5268, 21.3285, 105.0993, 22.8455],
    regionName: 'Tây Bắc Bộ',
    constituentCodes: ['10', '15'],
    constituentNames: ['Lào Cai', 'Yên Bái'],
  },
  '11': {
    code: '11',
    name: 'Điện Biên',
    center: [21.7217, 102.8683],
    bbox: [102.1415, 20.8948, 103.595, 22.5486],
    regionName: 'Tây Bắc Bộ',
    constituentCodes: ['11'],
    constituentNames: ['Điện Biên'],
  },
  '12': {
    code: '12',
    name: 'Lai Châu',
    center: [22.2497, 103.1507],
    bbox: [102.3181, 21.6871, 103.9833, 22.8123],
    regionName: 'Tây Bắc Bộ',
    constituentCodes: ['12'],
    constituentNames: ['Lai Châu'],
  },
  '14': {
    code: '14',
    name: 'Sơn La',
    center: [21.3029, 104.1176],
    bbox: [103.2133, 20.5749, 105.0218, 22.0308],
    regionName: 'Tây Bắc Bộ',
    constituentCodes: ['14'],
    constituentNames: ['Sơn La'],
  },
  '19': {
    code: '19',
    name: 'Thái Nguyên',
    center: [22.0342, 105.8372],
    bbox: [105.4296, 21.3266, 106.2448, 22.7417],
    regionName: 'Đông Bắc Bộ',
    constituentCodes: ['06', '19'],
    constituentNames: ['Bắc Kạn', 'Thái Nguyên'],
  },
  '20': {
    code: '20',
    name: 'Lạng Sơn',
    center: [21.8926, 106.7283],
    bbox: [106.0937, 21.3243, 107.3628, 22.4609],
    regionName: 'Đông Bắc Bộ',
    constituentCodes: ['20'],
    constituentNames: ['Lạng Sơn'],
  },
  '22': {
    code: '22',
    name: 'Quảng Ninh',
    center: [21.1911, 107.2615],
    bbox: [106.4373, 20.7174, 108.0858, 21.6648],
    regionName: 'Đông Bắc Bộ',
    constituentCodes: ['22'],
    constituentNames: ['Quảng Ninh'],
  },
  '25': {
    code: '25',
    name: 'Phú Thọ',
    center: [21.0136, 105.3334],
    bbox: [104.8121, 20.3065, 105.8547, 21.7206],
    regionName: 'Đông Bắc Bộ',
    constituentCodes: ['17', '25', '26'],
    constituentNames: ['Hòa Bình', 'Phú Thọ', 'Vĩnh Phúc'],
  },
  '27': {
    code: '27',
    name: 'Bắc Ninh',
    center: [21.2986, 106.455],
    bbox: [105.8797, 20.97, 107.0303, 21.6271],
    regionName: 'Đồng bằng sông Hồng',
    constituentCodes: ['24', '27'],
    constituentNames: ['Bắc Giang', 'Bắc Ninh'],
  },
  '31': {
    code: '31',
    name: 'Hải Phòng',
    center: [20.6798, 106.9329],
    bbox: [106.1262, 20.1251, 107.7396, 21.2345],
    regionName: 'Đồng bằng sông Hồng',
    constituentCodes: ['30', '31'],
    constituentNames: ['Hải Dương', 'Hải Phòng'],
  },
  '33': {
    code: '33',
    name: 'Hưng Yên',
    center: [20.6261, 106.273],
    bbox: [105.8933, 20.2443, 106.6527, 21.0078],
    regionName: 'Đồng bằng sông Hồng',
    constituentCodes: ['33', '34'],
    constituentNames: ['Hưng Yên', 'Thái Bình'],
  },
  '37': {
    code: '37',
    name: 'Ninh Bình',
    center: [20.3135, 106.0644],
    bbox: [105.5417, 19.9224, 106.5871, 20.7046],
    regionName: 'Đồng bằng sông Hồng',
    constituentCodes: ['35', '36', '37'],
    constituentNames: ['Hà Nam', 'Nam Định', 'Ninh Bình'],
  },
  '38': {
    code: '38',
    name: 'Thanh Hoá',
    center: [19.9798, 105.2238],
    bbox: [104.3738, 19.2888, 106.0738, 20.6709],
    regionName: 'Bắc Trung Bộ',
    constituentCodes: ['38'],
    constituentNames: ['Thanh Hóa'],
  },
  '40': {
    code: '40',
    name: 'Nghệ An',
    center: [19.2754, 104.8385],
    bbox: [103.8728, 18.5536, 105.8042, 19.9973],
    regionName: 'Bắc Trung Bộ',
    constituentCodes: ['40'],
    constituentNames: ['Nghệ An'],
  },
  '42': {
    code: '42',
    name: 'Hà Tĩnh',
    center: [18.3605, 105.8052],
    bbox: [105.102, 17.9144, 106.5083, 18.8067],
    regionName: 'Bắc Trung Bộ',
    constituentCodes: ['42'],
    constituentNames: ['Hà Tĩnh'],
  },
  '45': {
    code: '45',
    name: 'Quảng Trị',
    center: [17.1957, 106.496],
    bbox: [105.6061, 16.3005, 107.386, 18.0909],
    regionName: 'Bắc Trung Bộ',
    constituentCodes: ['44', '45'],
    constituentNames: ['Quảng Bình', 'Quảng Trị'],
  },
  '46': {
    code: '46',
    name: 'Huế',
    center: [16.37, 107.6124],
    bbox: [107.0325, 15.9961, 108.1922, 16.7439],
    regionName: 'Bắc Trung Bộ',
    constituentCodes: ['46'],
    constituentNames: ['Thừa Thiên Huế'],
  },
  '48': {
    code: '48',
    name: 'Đà Nẵng',
    center: [16.0544, 108.2022],
    bbox: [107.2086, 14.9533, 112.7361, 17.1203],
    regionName: 'Duyên hải Nam Trung Bộ',
    constituentCodes: ['48', '49'],
    constituentNames: ['Đà Nẵng', 'Quảng Nam'],
  },
  '51': {
    code: '51',
    name: 'Quảng Ngãi',
    center: [14.6784, 108.237],
    bbox: [107.3313, 13.9235, 109.1426, 15.4333],
    regionName: 'Duyên hải Nam Trung Bộ',
    constituentCodes: ['51', '62'],
    constituentNames: ['Quảng Ngãi', 'Kon Tum'],
  },
  '56': {
    code: '56',
    name: 'Khánh Hoà',
    center: [12.2585, 109.0526],
    bbox: [108.5494, 7.1838, 117.828, 12.8691],
    regionName: 'Duyên hải Nam Trung Bộ',
    constituentCodes: ['56', '58'],
    constituentNames: ['Khánh Hòa', 'Ninh Thuận'],
  },
  '64': {
    code: '64',
    name: 'Gia Lai',
    center: [13.8504, 108.3726],
    bbox: [107.4483, 12.9972, 109.2969, 14.7037],
    regionName: 'Tây Nguyên',
    constituentCodes: ['52', '64'],
    constituentNames: ['Bình Định', 'Gia Lai'],
  },
  '66': {
    code: '66',
    name: 'Đắk Lắk',
    center: [12.9287, 108.4697],
    bbox: [107.4824, 12.1618, 109.457, 13.6956],
    regionName: 'Tây Nguyên',
    constituentCodes: ['54', '66'],
    constituentNames: ['Phú Yên', 'Đắk Lắk'],
  },
  '68': {
    code: '68',
    name: 'Lâm Đồng',
    center: [11.6499, 108.0851],
    bbox: [107.2035, 10.4863, 108.9668, 12.8134],
    regionName: 'Tây Nguyên',
    constituentCodes: ['60', '67', '68'],
    constituentNames: ['Bình Thuận', 'Đắk Nông', 'Lâm Đồng'],
  },
  '72': {
    code: '72',
    name: 'Tây Ninh',
    center: [11.0899, 106.1227],
    bbox: [105.4997, 10.396, 106.7457, 11.7839],
    regionName: 'Đông Nam Bộ',
    constituentCodes: ['72', '80'],
    constituentNames: ['Tây Ninh', 'Long An'],
  },
  '75': {
    code: '75',
    name: 'Đồng Nai',
    center: [11.4399, 106.9938],
    bbox: [106.4118, 10.5797, 107.5758, 12.3],
    regionName: 'Đông Nam Bộ',
    constituentCodes: ['70', '75'],
    constituentNames: ['Bình Phước', 'Đồng Nai'],
  },
  '79': {
    code: '79',
    name: 'Hồ Chí Minh',
    center: [10.0671, 106.9487],
    bbox: [106.3277, 8.6315, 107.5697, 11.5027],
    regionName: 'Đông Nam Bộ',
    constituentCodes: ['74', '77', '79'],
    constituentNames: ['Bình Dương', 'Bà Rịa - Vũng Tàu', 'TP. Hồ Chí Minh'],
  },
  '86': {
    code: '86',
    name: 'Vĩnh Long',
    center: [9.9352, 106.2645],
    bbox: [105.6809, 9.5287, 106.848, 10.3418],
    regionName: 'Đồng bằng sông Cửu Long',
    constituentCodes: ['83', '84', '86'],
    constituentNames: ['Bến Tre', 'Trà Vinh', 'Vĩnh Long'],
  },
  '87': {
    code: '87',
    name: 'Đồng Tháp',
    center: [10.5546, 105.9993],
    bbox: [105.1864, 10.1352, 106.8122, 10.9741],
    regionName: 'Đồng bằng sông Cửu Long',
    constituentCodes: ['82', '87'],
    constituentNames: ['Tiền Giang', 'Đồng Tháp'],
  },
  '89': {
    code: '89',
    name: 'An Giang',
    center: [10.1251, 104.2258],
    bbox: [102.8777, 9.2867, 105.5739, 10.9634],
    regionName: 'Đồng bằng sông Cửu Long',
    constituentCodes: ['89', '91'],
    constituentNames: ['An Giang', 'Kiên Giang'],
  },
  '92': {
    code: '92',
    name: 'Cần Thơ',
    center: [9.7863, 105.7628],
    bbox: [105.224, 9.2465, 106.3017, 10.326],
    regionName: 'Đồng bằng sông Cửu Long',
    constituentCodes: ['92', '93', '94'],
    constituentNames: ['Cần Thơ', 'Hậu Giang', 'Sóc Trăng'],
  },
  '96': {
    code: '96',
    name: 'Cà Mau',
    center: [9.0256, 105.1896],
    bbox: [104.5205, 8.4137, 105.8586, 9.6376],
    regionName: 'Đồng bằng sông Cửu Long',
    constituentCodes: ['95', '96'],
    constituentNames: ['Bạc Liêu', 'Cà Mau'],
  },
  '01': {
    code: '01',
    name: 'Hà Nội',
    center: [20.9745, 105.6526],
    bbox: [105.287, 20.5648, 106.0183, 21.3842],
    regionName: 'Đồng bằng sông Hồng',
    constituentCodes: ['01'],
    constituentNames: ['Hà Nội'],
  },
  '04': {
    code: '04',
    name: 'Cao Bằng',
    center: [22.739, 106.0496],
    bbox: [105.2648, 22.3585, 106.8344, 23.1195],
    regionName: 'Đông Bắc Bộ',
    constituentCodes: ['04'],
    constituentNames: ['Cao Bằng'],
  },
  '08': {
    code: '08',
    name: 'Tuyên Quang',
    center: [22.448, 104.9642],
    bbox: [104.3343, 21.5027, 105.594, 23.3933],
    regionName: 'Đông Bắc Bộ',
    constituentCodes: ['02', '08'],
    constituentNames: ['Hà Giang', 'Tuyên Quang'],
  },
};

/** Chuẩn hóa chuỗi tiếng Việt để so khớp tìm kiếm (loại bỏ dấu, ký tự đặc biệt, lowercase) */
export function normalizeSearchStr(str: string): string {
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

/** Bảng bí danh tên tỉnh/thành phố phổ biến */
const PROVINCE_ALIASES: Record<string, { code63: string; code34: string }> = {
  'sai gon': { code63: '79', code34: '79' },
  saigon: { code63: '79', code34: '79' },
  tphcm: { code63: '79', code34: '79' },
  'tp hcm': { code63: '79', code34: '79' },
  'tp ho chi minh': { code63: '79', code34: '79' },
  'thanh pho ho chi minh': { code63: '79', code34: '79' },
  'thu do ha noi': { code63: '01', code34: '01' },
  'ha noi': { code63: '01', code34: '01' },
  hue: { code63: '46', code34: '46' },
  'thua thien hue': { code63: '46', code34: '46' },
  'vung tau': { code63: '77', code34: '79' },
  'ba ria': { code63: '77', code34: '79' },
  'ba ria vung tau': { code63: '77', code34: '79' },
  'da lat': { code63: '68', code34: '68' },
  dalat: { code63: '68', code34: '68' },
  'buon ma thuot': { code63: '66', code34: '66' },
  bmt: { code63: '66', code34: '66' },
  pleiku: { code63: '64', code34: '64' },
  'nha trang': { code63: '56', code34: '56' },
  'phan thiet': { code63: '60', code34: '68' },
  'quy nhon': { code63: '52', code34: '64' },
  'dak lak': { code63: '66', code34: '66' },
  daklak: { code63: '66', code34: '66' },
  'dac lac': { code63: '66', code34: '66' },
  'dak nong': { code63: '67', code34: '68' },
  daknong: { code63: '67', code34: '68' },
  'dac nong': { code63: '67', code34: '68' },
  'binh duong': { code63: '74', code34: '79' },
  'dong nai': { code63: '75', code34: '75' },
};

/**
 * Tra cứu thông tin toạ độ tỉnh thành theo mã hoặc tên
 */
export function getProvinceGeo(
  identifier: string,
  mode: ProvinceMode = '63',
): ProvinceGeoData | undefined {
  if (!identifier) return undefined;
  const map = mode === '34' ? PROVINCE_COORDINATES_34 : PROVINCE_COORDINATES_63;

  // 1. Tìm theo mã code chính xác
  if (map[identifier]) return map[identifier];

  const normInput = normalizeSearchStr(identifier);
  const compactInput = normInput.replace(/\s+/g, '');

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
    const compactName = normName.replace(/\s+/g, '');
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
  limit: number = 5,
): ProvinceSearchResult[] {
  const q = normalizeSearchStr(query);
  if (!q) return [];
  const qCompact = q.replace(/\s+/g, '');

  const map = mode === '34' ? PROVINCE_COORDINATES_34 : PROVINCE_COORDINATES_63;
  const results: ProvinceSearchResult[] = [];

  // Kiểm tra alias
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
      // Tìm trong danh sách các tỉnh cấu thành
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
        center: item.center,
        bbox: item.bbox,
        regionName: item.regionName,
        score,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
