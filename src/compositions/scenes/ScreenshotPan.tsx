import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'

interface Props {
  asset_url: string | null
  motion_type: string
  on_screen_text: string | null
}

export const ScreenshotPan: React.FC<Props> = ({
  asset_url,
  motion_type,
  on_screen_text,
}) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()

  // Pan direction based on motion_type.
  const panAmount = 80
  const translateX = motion_type === 'pan_right'
    ? interpolate(frame, [0, durationInFrames], [-panAmount, panAmount])
    : motion_type === 'pan_left'
    ? interpolate(frame, [0, durationInFrames], [panAmount, -panAmount])
    : 0
  const translateY = motion_type === 'pan_down'
    ? interpolate(frame, [0, durationInFrames], [-panAmount / 2, panAmount / 2])
    : motion_type === 'pan_up'
    ? interpolate(frame, [0, durationInFrames], [panAmount / 2, -panAmount / 2])
    : 0

  return (
    <AbsoluteFill style={{ backgroundColor: '#18181b' }}>
      {asset_url ? (
        <Img
          src={asset_url}
          style={{
            width: '120%',
            height: '120%',
            objectFit: 'cover',
            transform: `translate(${translateX}px, ${translateY}px)`,
            position: 'absolute',
            top: '-10%',
            left: '-10%',
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
