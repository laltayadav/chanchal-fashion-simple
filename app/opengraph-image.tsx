import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Chanchal Fashion storefront preview';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background:
            'linear-gradient(135deg, #5c1a2b 0%, #3e1220 52%, #c6963a 100%)',
          color: '#fffaf1',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '20px',
              background: 'rgba(251,245,234,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '42px',
            }}
          >
            ✦
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '24px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.88 }}>
              Chanchal Fashion
            </div>
            <div style={{ fontSize: '18px', color: 'rgba(255,250,241,0.82)', marginTop: '8px', fontFamily: 'sans-serif' }}>
              Elegant Sarees and Blouses
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '860px' }}>
          <div style={{ fontSize: '82px', lineHeight: 0.95, fontWeight: 700, fontFamily: 'serif' }}>
            Handpicked style for every celebration.
          </div>
          <div style={{ fontSize: '30px', lineHeight: 1.35, color: 'rgba(255,250,241,0.9)', fontFamily: 'sans-serif', maxWidth: '820px' }}>
            Curated sarees, statement blouses, and festive sets with a refined boutique look.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '22px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,250,241,0.88)' }}>
            chanchalfashion.com
          </div>
          <div style={{ fontSize: '18px', color: 'rgba(255,250,241,0.78)', fontFamily: 'sans-serif' }}>
            Shop • Share • Celebrate
          </div>
        </div>
      </div>
    ),
    size,
  );
}