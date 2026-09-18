import { NextRequest, NextResponse } from 'next/server';
import { searchProvinces } from '@/constants/province-coordinates';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || !q.trim()) {
    return NextResponse.json([]);
  }

  const query = q.trim();
  const results: Array<{ lat: string; lon: string; display_name: string }> = [];

  // 1. Kiểm tra khớp Tỉnh/Thành phố Việt Nam từ dữ liệu nội bộ (chính xác 100%, 0ms latency)
  const localProvinces = searchProvinces(query, '63', 3);
  for (const prov of localProvinces) {
    results.push({
      lat: String(prov.center[0]),
      lon: String(prov.center[1]),
      display_name: `Tỉnh/Thành phố: ${prov.displayName}${prov.regionName ? ` (${prov.regionName})` : ''}, Việt Nam`,
    });
  }

  // 2. Thử Photon Geocoder (Komoot) có giới hạn bounding box Việt Nam
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const photonRes = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&bbox=102.14,7.18,117.82,23.39&limit=6`,
      {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'OcopPlatform/1.0 (contact@iesconnect.vn)',
        },
      },
    );
    clearTimeout(timeoutId);

    if (photonRes.ok) {
      const data = await photonRes.json();
      if (data?.features && Array.isArray(data.features) && data.features.length > 0) {
        for (const f of data.features) {
          const latNum = f.geometry.coordinates[1];
          const lonNum = f.geometry.coordinates[0];

          // Lọc nghiêm ngặt: chỉ lấy toạ độ nằm trong lãnh thổ Việt Nam
          if (latNum < 7.0 || latNum > 24.5 || lonNum < 101.0 || lonNum > 119.0) {
            continue;
          }

          const p = f.properties || {};
          const parts = [p.name, p.district || p.county, p.city || p.state, 'Việt Nam'].filter(
            Boolean,
          );
          const displayName =
            parts.length > 0 ? Array.from(new Set(parts)).join(', ') : p.name || query;

          // Tránh trùng lặp toạ độ
          if (
            !results.some(
              (r) =>
                Math.abs(parseFloat(r.lat) - latNum) < 0.005 &&
                Math.abs(parseFloat(r.lon) - lonNum) < 0.005,
            )
          ) {
            results.push({
              lat: String(latNum),
              lon: String(lonNum),
              display_name: displayName,
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn('[Geocoding API] Photon search failed, trying fallback...', err);
  }

  // Nếu đã có kết quả thì trả về luôn
  if (results.length > 0) {
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  // 3. Dự phòng: Nominatim OpenStreetMap (giới hạn chặt chẽ countrycodes=vn và viewbox Việt Nam)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const nominatimRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query,
      )}&countrycodes=vn&viewbox=102.14,24.5,118.5,7.0&bounded=1&limit=5`,
      {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'OcopPlatform/1.0 (contact@iesconnect.vn)',
        },
      },
    );
    clearTimeout(timeoutId);

    if (nominatimRes.ok) {
      const data = await nominatimRes.json();
      if (Array.isArray(data)) {
        for (const item of data) {
          const latNum = parseFloat(item.lat);
          const lonNum = parseFloat(item.lon);
          if (latNum >= 7.0 && latNum <= 24.5 && lonNum >= 101.0 && lonNum <= 119.0) {
            results.push({
              lat: item.lat,
              lon: item.lon,
              display_name: item.display_name,
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn('[Geocoding API] Nominatim search fallback failed:', err);
  }

  return NextResponse.json(results, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
