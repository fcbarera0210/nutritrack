import { ImageResponse } from 'next/og';

export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#131917',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: '#3CCC1F',
            }}
          />
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: '#E5C438',
            }}
          />
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: '#DC3714',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
