import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion'

interface Props {
  asset_url: string | null
  on_screen_text: string | null
  visual_instruction: string | null
}

export const SplitScreen: React.FC<Props> = ({
  asset_url,
  on_screen_text,
  visual_instruction,
}) => {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ backgroundColor: '#18181b' }}>
      {/* Top half: image or placeholder */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', overflow: 'hidden' }}>
        {asset_url ? (
          <Img src={asset_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #27272a, #3f3f46)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ color: '#71717a', fontSize: 32, fontFamily: 'sans-serif' }}>
              {visual_instruction ?? 'No asset'}
            </div>
          </div>
        )}
      </div>

      {/* Bottom half: text content */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
          opacity,
        }}
      >
        <div
          style={{
            color: '#fafafa',
            fontSize: 48,
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.3,
            fontFamily: 'sans-serif',
          }}
        >
          {on_screen_text ?? visual_instruction ?? ''}
        </div>
      </div>
    </AbsoluteFill>
  )
}
