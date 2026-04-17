import { AbsoluteFill, OffthreadVideo, useVideoConfig } from 'remotion'

interface Props {
  asset_url: string | null
  on_screen_text: string | null
}

export const VideoClip: React.FC<Props> = ({ asset_url, on_screen_text }) => {
  const { durationInFrames, fps } = useVideoConfig()

  return (
    <AbsoluteFill style={{ backgroundColor: '#18181b' }}>
      {asset_url ? (
        <OffthreadVideo
          src={asset_url}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          endAt={durationInFrames / fps}
        />
      ) : (
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #27272a, #3f3f46)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ color: '#71717a', fontSize: 36, fontFamily: 'sans-serif' }}>
            No video
          </div>
        </AbsoluteFill>
      )}
      {on_screen_text && (
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: 60,
          }}
        >
          <div
            style={{
              color: '#fafafa',
              fontSize: 44,
              fontWeight: 700,
              textShadow: '0 2px 8px rgba(0,0,0,0.7)',
              textAlign: 'center',
              fontFamily: 'sans-serif',
            }}
          >
            {on_screen_text}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  )
}
