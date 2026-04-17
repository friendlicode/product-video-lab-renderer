import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion'

interface Props {
  asset_url: string | null
  on_screen_text: string | null
}

export const LogoReveal: React.FC<Props> = ({ asset_url, on_screen_text }) => {
  const frame = useCurrentFrame()
  const scale = interpolate(frame, [0, 20], [0.6, 1], { extrapolateRight: 'clamp' })
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const textOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
      }}
    >
      {asset_url ? (
        <Img
          src={asset_url}
          style={{
            maxWidth: '60%',
            maxHeight: '40%',
            objectFit: 'contain',
            opacity,
            transform: `scale(${scale})`,
          }}
        />
      ) : (
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: 40,
            background: 'linear-gradient(135deg, #3f3f46, #52525b)',
            opacity,
            transform: `scale(${scale})`,
          }}
        />
      )}
      {on_screen_text && (
        <div
          style={{
            color: '#fafafa',
            fontSize: 44,
            fontWeight: 600,
            opacity: textOpacity,
            textAlign: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          {on_screen_text}
        </div>
      )}
    </AbsoluteFill>
  )
}
