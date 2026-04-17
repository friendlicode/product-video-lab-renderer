import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'

interface CaptionSegment {
  start_ms: number
  end_ms: number
  text: string
}

interface Props {
  captions: CaptionSegment[]
}

export const CaptionOverlay: React.FC<Props> = ({ captions }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const currentMs = (frame / fps) * 1000

  const active = captions.find((c) => currentMs >= c.start_ms && currentMs < c.end_ms)
  if (!active) return null

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0 40px 120px',
      }}
    >
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.75)',
          color: '#fafafa',
          fontSize: 36,
          fontWeight: 600,
          padding: '12px 28px',
          borderRadius: 12,
          textAlign: 'center',
          maxWidth: '85%',
          lineHeight: 1.4,
          fontFamily: 'sans-serif',
        }}
      >
        {active.text}
      </div>
    </AbsoluteFill>
  )
}
