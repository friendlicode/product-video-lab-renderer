import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import { join } from 'path'
import { tmpdir } from 'os'
import { readFile, rm } from 'fs/promises'
import { supabase } from './supabase.js'
import { makeThumbnail } from './thumbnail.js'

function dimsFor(ar: string): { width: number; height: number } {
  switch (ar) {
    case '1:1':  return { width: 1080, height: 1080 }
    case '16:9': return { width: 1920, height: 1080 }
    case '4:5':  return { width: 1080, height: 1350 }
    default:     return { width: 1080, height: 1920 } // 9:16
  }
}

// Cache the bundle so we only build once per worker lifetime.
let bundlePromise: Promise<string> | null = null

function getBundle(): Promise<string> {
  if (!bundlePromise) {
    console.log('[renderer] Bundling Remotion compositions...')
    bundlePromise = bundle({
      entryPoint: join(import.meta.dirname ?? '.', 'compositions', 'Root.tsx'),
      onProgress: (pct) => {
        if (pct === 100) console.log('[renderer] Bundle complete')
      },
    })
  }
  return bundlePromise
}

export async function renderProject(
  jobId: string,
  payload: Record<string, unknown>,
  aspectRatio: string
): Promise<{ output_url: string; thumbnail_url: string }> {
  const serveUrl = await getBundle()

  const scenes = (payload.scenes ?? []) as Array<{ duration_seconds?: number }>
  const totalDuration = scenes.reduce((s, sc) => s + Number(sc.duration_seconds ?? 3), 0)
  const fps = 30
  const durationInFrames = Math.max(1, Math.ceil(totalDuration * fps))
  const { width, height } = dimsFor(aspectRatio)

  // Resolve voiceover audio URL from the script data if available.
  const script = payload.script as Record<string, unknown> | undefined
  const voiceoverUrl = (script as { audio_url?: string })?.audio_url ?? null

  const inputProps = {
    scenes: payload.scenes ?? [],
    captions: payload.captions ?? [],
    voiceoverUrl,
    cta: payload.cta ?? null,
  }

  // Select the composition to get a proper VideoConfig object.
  const composition = await selectComposition({
    serveUrl,
    id: 'VideoProject',
    inputProps,
  })

  // Override dimensions and duration from the payload.
  composition.width = width
  composition.height = height
  composition.durationInFrames = durationInFrames
  composition.fps = fps

  const outPath = join(tmpdir(), `${jobId}.mp4`)

  console.log(`[renderer] Rendering ${durationInFrames} frames at ${width}x${height} (${aspectRatio})`)

  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: outPath,
    inputProps,
    onProgress: async ({ progress }) => {
      const pct = Math.round(progress * 100)
      if (pct % 10 === 0) {
        console.log(`[renderer] Job ${jobId}: ${pct}%`)
        await supabase.from('render_jobs').update({ progress: pct }).eq('id', jobId)
      }
    },
  })

  console.log(`[renderer] Render complete, generating thumbnail...`)

  // Generate thumbnail from first frame.
  const thumbBuf = await makeThumbnail(serveUrl, inputProps, width, height)

  // Upload video + thumbnail to Supabase storage.
  const videoKey = `${jobId}/output.mp4`
  const thumbKey = `${jobId}/thumbnail.png`

  console.log(`[renderer] Uploading output...`)

  const videoData = await readFile(outPath)

  await supabase.storage
    .from('render-outputs')
    .upload(videoKey, videoData, { contentType: 'video/mp4', upsert: true })

  await supabase.storage
    .from('render-outputs')
    .upload(thumbKey, thumbBuf, { contentType: 'image/png', upsert: true })

  // 1-year signed URLs.
  const { data: videoSigned } = await supabase.storage
    .from('render-outputs')
    .createSignedUrl(videoKey, 60 * 60 * 24 * 365)

  const { data: thumbSigned } = await supabase.storage
    .from('render-outputs')
    .createSignedUrl(thumbKey, 60 * 60 * 24 * 365)

  const output_url = videoSigned?.signedUrl ?? ''
  const thumbnail_url = thumbSigned?.signedUrl ?? ''

  // Clean up temp files.
  await rm(outPath, { force: true }).catch(() => {})

  return { output_url, thumbnail_url }
}
