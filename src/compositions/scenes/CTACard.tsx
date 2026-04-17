import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'

interface Props {
  on_screen_text: string | null
  cta_script: string | null
  motion_type: string
}

export const CTACard: React.FC<Props> = ({ on_screen_text, cta_script, motion_type }) => {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const scale = motion_type === 'bounce'
    ? interpolate(frame, [0, 12, 20], [0.85, 1.06, 1], { extrapolateRight: 'clamp' })
    : interpolate(frame, [0, 15], [0.95, 1], { extrapolateRight: 'clamp' })

  const text = on_screen_text ?? cta_script ?? 'Learn More'

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 30,
        }}
      >
        <div
          style={{
            color: '#fafafa',
            fontSize: 60,
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.2,
            fontFamily: 'sans-serif',
          }}
        >
          {text}
        </div>
        <div
          style={{
            background: '#fafafa',
            color: '#14532d',
            fontSize: 32,
            fontWeight: 700,
            padding: '16px 48px',
            borderRadius: 16,
            fontFamily: 'sans-serif',
          }}
        >
          Get Started
        </div>
      </div>
    </AbsoluteFill>
  )
}
