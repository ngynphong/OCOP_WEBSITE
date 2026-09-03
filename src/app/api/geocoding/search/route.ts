import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || !q.trim()) {
    return NextResponse.json([]);
  }

  const query = q.trim();

  // 1. Thử Photon Geocoder (Komoot - dữ liệu OSM toàn cầu, CDN nhanh, hỗ trợ tốt tiếng Việt)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const photonRes = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`,
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
        const results = data.features.map(
          (f: {
            geometry: { coordinates: [number, number] };
            properties: {
              name?: string;
              district?: string;
              county?: string;
              city?: string;
              state?: string;
              country?: string;
            };
          }) => {
            const p = f.properties || {};
            const parts = [p.name, p.district || p.county, p.city || p.state, p.country].filter(
              Boolean,
            );
            const displayName =
              parts.length > 0 ? Array.from(new Set(parts)).join(', ') : p.name || query;
            return {
              lat: String(f.geometry.coordinates[1]),
              lon: String(f.geometry.coordinates[0]),
              display_name: displayName,
            };
          },
        );
        return NextResponse.json(results, {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        });
      }
    }
  } catch (err) {
    console.warn('[Geocoding API] Photon search failed, trying fallback...', err);
  }

  // 2. Dự phòng: Nominatim OpenStreetMap (kèm header User-Agent bắt buộc)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const nominatimRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query,
      )}&countrycodes=vn&limit=5`,
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
        return NextResponse.json(data, {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        });
      }
    }
  } catch (err) {
    console.warn('[Geocoding API] Nominatim search fallback failed:', err);
  }

  return NextResponse.json([]);
}
