import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'ดูอิปซี - ดูไพ่ยิปซีออนไลน์ ฟรี ทำนายด้วย AI';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const notoSansThai = await fetch(
    'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@700&display=swap'
  ).then(res => res.text())
    .then(css => {
      const url = css.match(/src: url\((.+?)\)/)?.[1];
      return url ? fetch(url).then(r => r.arrayBuffer()) : null;
    })
    .catch(() => null);

  const fontOptions = notoSansThai
    ? [{ name: 'NotoSansThai', data: notoSansThai, style: 'normal' as const, weight: 700 as const }]
    : [];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 30%, #4a1a8a 60%, #1a0533 100%)',
          fontFamily: notoSansThai ? 'NotoSansThai' : 'sans-serif',
        }}
      >
        <div style={{ fontSize: 100, marginBottom: 20, display: 'flex' }}>🔮</div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            marginBottom: 16,
            display: 'flex',
          }}
        >
          ดูอิปซี
        </div>
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
          }}
        >
          ดูไพ่ยิปซีออนไลน์ ฟรี ทำนายด้วย AI
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.5)',
            display: 'flex',
          }}
        >
          dooyipsee.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontOptions,
    },
  );
}
