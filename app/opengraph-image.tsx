import { ImageResponse } from 'next/og';

export const alt = 'NutriTrack - Registro de Alimentos';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#3CCC1F',
              }}
            />
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#E5C438',
              }}
            />
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#DC3714',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div
              style={{
                fontSize: '96px',
                fontWeight: 'bold',
                color: '#131917',
                fontFamily: 'Quicksand, sans-serif',
              }}
            >
              NutriTrack
            </div>
            <div
              style={{
                fontSize: '48px',
                color: '#757575',
                fontFamily: 'Quicksand, sans-serif',
              }}
            >
              Registro de Alimentos
            </div>
            <div
              style={{
                fontSize: '32px',
                color: '#5A5B5A',
                fontFamily: 'Quicksand, sans-serif',
                marginTop: '20px',
              }}
            >
              Seguimiento nutricional con análisis y estadísticas
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
