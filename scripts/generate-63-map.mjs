import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as topojson from 'topojson-client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOPO_FILE = path.resolve(__dirname, '../public/maps/vn-topo.json');
const OUTPUT_FILE = path.resolve(__dirname, '../public/maps/vn-63-provinces.geojson');

function computeBBox(geom) {
  let minLon = 180, minLat = 90, maxLon = -180, maxLat = -90;
  function walk(coords) {
    if (typeof coords[0] === 'number') {
      const [lon, lat] = coords;
      if (lon < minLon) minLon = lon;
      if (lat < minLat) minLat = lat;
      if (lon > maxLon) maxLon = lon;
      if (lat > maxLat) maxLat = lat;
    } else {
      for (const c of coords) walk(c);
    }
  }
  walk(geom.coordinates);
  return [Number(minLon.toFixed(6)), Number(minLat.toFixed(6)), Number(maxLon.toFixed(6)), Number(maxLat.toFixed(6))];
}

function norm(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

const customMap = {
  'haiphong': 'haiphong',
  'southeast': 'dongnai',
  'hochiminhcity': 'tphochiminh',
  'hue': 'thuathienhue',
  'baclieu': 'baclieu',
  'bariavungtau': 'bariavungtau',
  'quangnam': 'quangnam',
  'danang': 'danang',
  'hanoi': 'hanoi',
  'hatinh': 'hatinh',
  'laichau': 'laichau',
  'sonla': 'sonla',
  'cantho': 'cantho',
  'daklak': 'daklak',
  'hungyen': 'hungyen'
};

function build63ProvincesGeoJSON() {
  console.log(`Reading topojson from: ${TOPO_FILE}`);
  const rawTopo = JSON.parse(fs.readFileSync(TOPO_FILE, 'utf-8'));
  const geojson = topojson.feature(rawTopo, rawTopo.objects.default);

  // Read regions-map.ts metadata
  const regionsTs = fs.readFileSync(path.resolve(__dirname, '../src/constants/regions-map.ts'), 'utf-8');
  const p63Regex = /'(\d{2})':\s*\{\s*code:\s*'(\d{2})',\s*name:\s*'([^']+)',\s*regionId:\s*(\d),\s*regionName:\s*'([^']+)',\s*macroRegion:\s*'([^']+)',\s*macroRegionName:\s*'([^']+)',\s*parent34Code:\s*'(\d{2})',\s*parent34Name:\s*'([^']+)'/g;
  const p63Entries = [...regionsTs.matchAll(p63Regex)].map(m => ({
    code: m[1],
    name: m[3],
    regionId: parseInt(m[4], 10),
    regionName: m[5],
    macroRegion: m[6],
    macroRegionName: m[7],
    parent34Code: m[8],
    parent34Name: m[9],
  }));

  const topoLookup = {};
  for (const f of geojson.features) {
    const raw = f.properties.name;
    const n = norm(raw);
    const key = customMap[n] || n;
    topoLookup[key] = f;
  }

  const features = [];
  let minLon = 180, minLat = 90, maxLon = -180, maxLat = -90;

  for (const meta of p63Entries) {
    const key = norm(meta.name);
    const matched = topoLookup[key];
    if (!matched) {
      console.warn(`Could not match 63 province: ${meta.name} (key: ${key})`);
      continue;
    }

    const bbox = computeBBox(matched.geometry);
    minLon = Math.min(minLon, bbox[0]);
    minLat = Math.min(minLat, bbox[1]);
    maxLon = Math.max(maxLon, bbox[2]);
    maxLat = Math.max(maxLat, bbox[3]);

    const lat = parseFloat(matched.properties.latitude || matched.properties['hc-middle-lat'] || ((bbox[1] + bbox[3]) / 2).toFixed(4));
    const lon = parseFloat(matched.properties.longitude || matched.properties['hc-middle-lon'] || ((bbox[0] + bbox[2]) / 2).toFixed(4));

    const feature = {
      type: 'Feature',
      id: meta.code,
      bbox,
      properties: {
        code: meta.code,
        name: meta.name,
        regionId: meta.regionId,
        regionName: meta.regionName,
        macroRegion: meta.macroRegion,
        macroRegionName: meta.macroRegionName,
        parent34Code: meta.parent34Code,
        parent34Name: meta.parent34Name,
        center: [lat, lon],
      },
      geometry: matched.geometry,
    };

    features.push(feature);
  }

  console.log(`Matched ${features.length} / ${p63Entries.length} provinces.`);

  const collection = {
    type: 'FeatureCollection',
    bbox: [minLon, minLat, maxLon, maxLat],
    features: features.sort((a, b) => a.properties.code.localeCompare(b.properties.code)),
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(collection), 'utf-8');
  const sizeMb = (Buffer.byteLength(JSON.stringify(collection)) / (1024 * 1024)).toFixed(2);
  console.log(`Successfully generated: ${OUTPUT_FILE} (${sizeMb} MB)`);
}

build63ProvincesGeoJSON();
