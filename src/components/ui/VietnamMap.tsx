import React, { useState, memo, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { useRouter } from 'next/navigation';

const geoUrl = '/maps/vn-topo.json';

interface MapGeography {
  properties: {
    name?: string;
    NAME_1?: string;
    ten_tinh?: string;
  };
}

const VietnamMap = memo(function VietnamMap({
  onSelectProvince,
}: {
  onSelectProvince: (provinceName: string) => void;
}) {
  const router = useRouter();
  const [tooltip, setTooltip] = useState('');

  const handleProvinceClick = useCallback(
    (geo: MapGeography | { properties: { name: string } }) => {
      const provinceName =
        geo.properties.name ||
        (geo as MapGeography).properties.NAME_1 ||
        (geo as MapGeography).properties.ten_tinh ||
        '';

      if (onSelectProvince) onSelectProvince(provinceName);

      // Push url
      router.push(`/vung-mien?province=${encodeURIComponent(provinceName)}`, { scroll: false });
    },
    [onSelectProvince, router],
  );

  const handleMouseEnter = useCallback((geo: MapGeography) => {
    const name = geo.properties.name || geo.properties.NAME_1 || geo.properties.ten_tinh || '';
    setTooltip(name);
  }, []);

  const handleMouseLeave = useCallback(() => setTooltip(''), []);

  return (
    <div className="relative w-full h-[500px] mx-auto">
      {/* Hiển thị tên tỉnh khi hover */}
      {tooltip && (
        <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-md px-4 py-2 border border-green-500/50 text-green-700 font-bold rounded-xl shadow-lg z-20 animate-in fade-in zoom-in duration-200 pointer-events-none">
          {tooltip}
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 3000,
          center: [108, 16],
        }}
        className="w-full h-full outline-none"
      >
        <ZoomableGroup zoom={1} center={[108, 16]}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleProvinceClick(geo)}
                  onMouseEnter={() => handleMouseEnter(geo)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    default: {
                      fill: '#f0f9ff',
                      stroke: '#bae6fd',
                      strokeWidth: 0.5,
                      outline: 'none',
                      transition: 'all 250ms',
                    },
                    hover: {
                      fill: '#16a34a',
                      stroke: '#ffffff',
                      strokeWidth: 1,
                      outline: 'none',
                      cursor: 'pointer',
                    },
                    pressed: {
                      fill: '#15803d',
                      outline: 'none',
                    },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Quần đảo Hoàng Sa (Đà Nẵng) */}
          {[
            [111.5, 16.8],
            [111.8, 16.6],
            [112.0, 16.5],
            [112.2, 16.4],
            [112.4, 16.7],
            [111.6, 16.3],
            [112.5, 16.2],
            [112.7, 16.5],
          ].map((coord, idx) => (
            <Marker
              key={`hs-${idx}`}
              coordinates={coord as [number, number]}
              onClick={() => handleProvinceClick({ properties: { name: 'Đà Nẵng' } })}
              onMouseEnter={() => setTooltip('Quần đảo Hoàng Sa (Đà Nẵng)')}
              onMouseLeave={handleMouseLeave}
            >
              <circle
                r={0.7}
                fill="#16a34a"
                className="cursor-pointer hover:fill-green-700 transition-colors"
              />
            </Marker>
          ))}
          <Marker
            coordinates={[112.0, 16.5]}
            onClick={() => handleProvinceClick({ properties: { name: 'Đà Nẵng' } })}
            onMouseEnter={() => setTooltip('Quần đảo Hoàng Sa (Đà Nẵng)')}
            onMouseLeave={handleMouseLeave}
            className="pointer-events-none"
          >
            <text
              textAnchor="middle"
              y={-5}
              style={{
                fontFamily: 'sans-serif',
                fill: '#1f2937',
                fontSize: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                pointerEvents: 'auto',
              }}
            >
              QĐ. Hoàng Sa
            </text>
          </Marker>

          {/* Quần đảo Trường Sa (Khánh Hòa) */}
          {[
            [114.0, 10.0],
            [113.5, 9.7],
            [114.5, 10.3],
            [113.2, 10.5],
            [114.8, 9.5],
            [113.8, 9.1],
            [114.2, 8.8],
            [115.2, 10.2],
            [113.0, 8.5],
            [115.5, 11.0],
            [113.9, 11.2],
            [114.6, 10.8],
            [115.0, 9.0],
            [114.1, 9.5],
            [113.6, 10.1],
            [112.5, 8.8],
            [113.3, 9.3],
            [112.8, 10.1],
            [114.4, 11.3],
            [112.2, 9.5],
          ].map((coord, idx) => (
            <Marker
              key={`ts-${idx}`}
              coordinates={coord as [number, number]}
              onClick={() => handleProvinceClick({ properties: { name: 'Khánh Hòa' } })}
              onMouseEnter={() => setTooltip('Quần đảo Trường Sa (Khánh Hòa)')}
              onMouseLeave={handleMouseLeave}
            >
              <circle
                r={0.7}
                fill="#16a34a"
                className="cursor-pointer hover:fill-green-700 transition-colors"
              />
            </Marker>
          ))}
          <Marker
            coordinates={[114.0, 10.0]}
            onClick={() => handleProvinceClick({ properties: { name: 'Khánh Hòa' } })}
            onMouseEnter={() => setTooltip('Quần đảo Trường Sa (Khánh Hòa)')}
            onMouseLeave={handleMouseLeave}
            className="pointer-events-none"
          >
            <text
              textAnchor="middle"
              y={-5}
              style={{
                fontFamily: 'sans-serif',
                fill: '#1f2937',
                fontSize: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                pointerEvents: 'auto',
              }}
            >
              QĐ. Trường Sa
            </text>
          </Marker>

          {/* Đảo Phú Quốc (Kiên Giang) */}
          <Marker
            coordinates={[103.95, 10.21]}
            onClick={() => handleProvinceClick({ properties: { name: 'Kiên Giang' } })}
            onMouseEnter={() => setTooltip('Đảo Phú Quốc (Kiên Giang)')}
            onMouseLeave={handleMouseLeave}
          >
            <circle
              r={1.5}
              fill="#16a34a"
              className="cursor-pointer hover:fill-green-700 transition-colors"
            />
            <text
              textAnchor="end"
              x={-3}
              y={1.5}
              style={{
                fontFamily: 'sans-serif',
                fill: '#1f2937',
                fontSize: '3px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Phú Quốc
            </text>
          </Marker>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
});

export default VietnamMap;
