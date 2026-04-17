import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'

interface Props {
  asset_url: string | null
  motion_type: string
  on_screen_text: string | null
}

export const ScreenshotZoom: React.FC<Props> = ({
  asset_url,
  motion_type,
  on_screen_text,
}) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()

  const zoomIn = motion_type !== 'slow_zoom_out'
  const scale = zoomIn
    ? interpolate(frame, [0, durationInFrames], [1, 1.15])
    : interpolate(frame, [0, durationInFrames], [1.15, 1])

  return (
    <AbsoluteFill style={{ backgroundColor: '#18181b' }}>
      {asset_url ? (
        <Img
          src={asset_url}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale})`,
          }}
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
            No image
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
              fontSize: 48,
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
