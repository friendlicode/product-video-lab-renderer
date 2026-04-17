import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'

interface Props {
  on_screen_text: string | null
  visual_instruction: string | null
  motion_type: string
}

export const TextOverlay: React.FC<Props> = ({
  on_screen_text,
  visual_instruction,
  motion_type,
}) => {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const scale = motion_type === 'bounce'
    ? interpolate(frame, [0, 10, 20], [0.8, 1.05, 1], { extrapolateRight: 'clamp' })
    : motion_type === 'slide_up'
    ? 1
    : 1

  const translateY = motion_type === 'slide_up'
    ? interpolate(frame, [0, 20], [40, 0], { extrapolateRight: 'clamp' })
    : 0

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale}) translateY(${translateY}px)`,
          textAlign: 'center',
        }}
      >
        {on_screen_text && (
          <div
            style={{
              color: '#fafafa',
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.3,
              fontFamily: 'sans-serif',
            }}
          >
            {on_screen_text}
          </div>
        )}
        {visual_instruction && !on_screen_text && (
          <div
            style={{
              color: '#a1a1aa',
              fontSize: 48,
              fontWeight: 500,
              lineHeight: 1.4,
              fontFamily: 'sans-serif',
            }}
          >
            {visual_instruction}
          </div>
        )}
      </div>
    </AbsoluteFill>
  )
}
