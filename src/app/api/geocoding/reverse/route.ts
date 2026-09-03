import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon') || searchParams.get('lng');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing lat or lon' }, { status: 400 });
  }

  // 1. Thử Photon Reverse Geocoding
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'OcopPlatform/1.0 (contact@iesconnect.vn)',
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const feature = data?.features?.[0];
      if (feature?.properties) {
        const p = feature.properties;
        const parts = [
          p.name,
          p.street,
          p.district || p.county,
          p.city || p.state,
          p.country,
        ].filter(Boolean);
        const displayName =
          parts.length > 0
            ? Array.from(new Set(parts)).join(', ')
            : `${parseFloat(lat).toFixed(4)}, ${parseFloat(lon).toFixed(4)}`;
        return NextResponse.json(
          {
            display_name: displayName,
            lat,
            lon,
          },
          {
            headers: {
              'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
            },
          },
        );
      }
    }
  } catch (err) {
    console.warn('[Geocoding Reverse] Photon reverse failed, trying fallback...', err);
  }

  // 2. Dự phòng: Nominatim Reverse
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=vi`,
      {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'OcopPlatform/1.0 (contact@iesconnect.vn)',
        },
      },
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      });
    }
  } catch (err) {
    console.warn('[Geocoding Reverse] Nominatim reverse fallback failed:', err);
  }

  return NextResponse.json({
    display_name: `${parseFloat(lat).toFixed(4)}, ${parseFloat(lon).toFixed(4)}`,
    lat,
    lon,
  });
}
