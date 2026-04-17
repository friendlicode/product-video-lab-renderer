import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'

interface Props {
  on_screen_text: string | null
  visual_instruction: string | null
}

export const TransitionCard: React.FC<Props> = ({ on_screen_text, visual_instruction }) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' })
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  )
  const opacity = Math.min(fadeIn, fadeOut)

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
      }}
    >
      <div style={{ opacity, textAlign: 'center' }}>
        {on_screen_text && (
          <div
            style={{
              color: '#d4d4d8',
              fontSize: 52,
              fontWeight: 600,
              lineHeight: 1.3,
              fontFamily: 'sans-serif',
            }}
          >
            {on_screen_text}
          </div>
        )}
        {!on_screen_text && visual_instruction && (
          <div
            style={{
              color: '#71717a',
              fontSize: 40,
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
