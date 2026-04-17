import { AbsoluteFill, Audio, Sequence, useVideoConfig } from 'remotion'
import { TextOverlay } from './scenes/TextOverlay'
import { ScreenshotPan } from './scenes/ScreenshotPan'
import { ScreenshotZoom } from './scenes/ScreenshotZoom'
import { VideoClip } from './scenes/VideoClip'
import { SplitScreen } from './scenes/SplitScreen'
import { LogoReveal } from './scenes/LogoReveal'
import { CTACard } from './scenes/CTACard'
import { TransitionCard } from './scenes/TransitionCard'
import { CaptionOverlay } from './CaptionOverlay'

interface SceneData {
  scene_index: number
  scene_type: string
  narrative_role: string
  duration_seconds: number
  asset_url: string | null
  asset_type: string | null
  visual_instruction: string | null
  motion_type: string
  on_screen_text: string | null
  voiceover_line: string | null
  caption_text: string | null
  transition_type: string
  captions: Array<{ start_ms: number; end_ms: number; text: string }>
}

interface Props {
  scenes: SceneData[]
  captions: Array<{ start_ms: number; end_ms: number; text: string }>
  voiceoverUrl: string | null
  cta: string | null
}

function SceneComponent({ scene, cta }: { scene: SceneData; cta: string | null }) {
  switch (scene.scene_type) {
    case 'text_overlay':
      return (
        <TextOverlay
          on_screen_text={scene.on_screen_text}
          visual_instruction={scene.visual_instruction}
          motion_type={scene.motion_type}
        />
      )
    case 'screenshot_pan':
      return (
        <ScreenshotPan
          asset_url={scene.asset_url}
          motion_type={scene.motion_type}
          on_screen_text={scene.on_screen_text}
        />
      )
    case 'screenshot_zoom':
      return (
        <ScreenshotZoom
          asset_url={scene.asset_url}
          motion_type={scene.motion_type}
          on_screen_text={scene.on_screen_text}
        />
      )
    case 'video_clip':
      return (
        <VideoClip
          asset_url={scene.asset_url}
          on_screen_text={scene.on_screen_text}
        />
      )
    case 'split_screen':
      return (
        <SplitScreen
          asset_url={scene.asset_url}
          on_screen_text={scene.on_screen_text}
          visual_instruction={scene.visual_instruction}
        />
      )
    case 'logo_reveal':
      return (
        <LogoReveal
          asset_url={scene.asset_url}
          on_screen_text={scene.on_screen_text}
        />
      )
    case 'cta_card':
      return (
        <CTACard
          on_screen_text={scene.on_screen_text}
          cta_script={cta}
          motion_type={scene.motion_type}
        />
      )
    case 'transition_card':
      return (
        <TransitionCard
          on_screen_text={scene.on_screen_text}
          visual_instruction={scene.visual_instruction}
        />
      )
    default:
      // 'custom' or unknown types render as text overlay
      return (
        <TextOverlay
          on_screen_text={scene.on_screen_text ?? scene.visual_instruction ?? scene.scene_type}
          visual_instruction={scene.visual_instruction}
          motion_type={scene.motion_type ?? 'fade_in'}
        />
      )
  }
}

export const VideoProject: React.FC<Props> = ({
  scenes,
  captions,
  voiceoverUrl,
  cta,
}) => {
  const { fps } = useVideoConfig()

  // Build a running offset for each scene in frames.
  let frameOffset = 0
  const sceneEntries = scenes.map((scene) => {
    const durationFrames = Math.ceil((scene.duration_seconds ?? 3) * fps)
    const entry = { scene, from: frameOffset, durationFrames }
    frameOffset += durationFrames
    return entry
  })

  return (
    <AbsoluteFill>
      {/* Scene sequences */}
      {sceneEntries.map(({ scene, from, durationFrames }) => (
        <Sequence key={scene.scene_index} from={from} durationInFrames={durationFrames}>
          <SceneComponent scene={scene} cta={cta} />
        </Sequence>
      ))}

      {/* Voiceover audio track (spans entire video) */}
      {voiceoverUrl && (
        <Audio src={voiceoverUrl} volume={1} />
      )}

      {/* Caption overlay (spans entire video, uses timestamps to show/hide) */}
      {captions.length > 0 && (
        <CaptionOverlay captions={captions} />
      )}
    </AbsoluteFill>
  )
}
