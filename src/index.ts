import 'dotenv/config'
import { supabase } from './supabase.js'
import { renderProject } from './render.js'

const POLL_MS = Number(process.env.RENDER_POLL_INTERVAL_MS ?? 5000)
let shuttingDown = false

process.on('SIGTERM', () => { shuttingDown = true })
process.on('SIGINT', () => { shuttingDown = true })

async function claimJob() {
  // Find the oldest queued job.
  const { data: jobs } = await supabase
    .from('render_jobs')
    .select('id')
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(1)

  if (!jobs?.length) return null

  // Atomically claim it by setting status to processing.
  // The eq('status','queued') guard prevents two workers from claiming the same job.
  const { data, error } = await supabase
    .from('render_jobs')
    .update({ status: 'processing', started_at: new Date().toISOString() })
    .eq('id', jobs[0].id)
    .eq('status', 'queued')
    .select()
    .single()

  if (error || !data) return null
  return data
}

async function processJob(jobId: string) {
  try {
    const { data: job } = await supabase
      .from('render_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (!job) throw new Error(`Job ${jobId} not found`)

    const { data: payload } = await supabase
      .from('render_payloads')
      .select('*')
      .eq('id', job.render_payload_id)
      .single()

    if (!payload) throw new Error(`Payload ${job.render_payload_id} not found`)

    console.log(`[renderer] Processing job ${jobId} (payload ${payload.id})`)

    const { output_url, thumbnail_url } = await renderProject(
      jobId,
      payload.payload,
      payload.aspect_ratio
    )

    await supabase.from('render_jobs').update({
      status: 'completed',
      output_url,
      thumbnail_url,
      progress: 100,
      completed_at: new Date().toISOString(),
    }).eq('id', jobId)

    // Advance project status from rendering to review.
    await supabase
      .from('projects')
      .update({ status: 'review' })
      .eq('id', job.project_id)
      .eq('status', 'rendering')

    console.log(`[renderer] Job ${jobId} completed`)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error(`[renderer] Job ${jobId} failed: ${msg}`)

    await supabase.from('render_jobs').update({
      status: 'failed',
      error_message: msg,
      completed_at: new Date().toISOString(),
    }).eq('id', jobId)
  }
}

async function main() {
  console.log(`[renderer] Polling every ${POLL_MS}ms`)

  while (!shuttingDown) {
    const job = await claimJob()
    if (job) {
      await processJob(job.id)
    } else {
      await new Promise((r) => setTimeout(r, POLL_MS))
    }
  }

  console.log('[renderer] Shutting down gracefully')
}

main().catch((e) => {
  console.error('[renderer] Fatal:', e)
  process.exit(1)
})
