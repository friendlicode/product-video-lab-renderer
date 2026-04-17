import { renderStill, selectComposition } from '@remotion/renderer'
import { readFile, mkdtemp, rm } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

/**
 * Render the first frame of the composition as a PNG thumbnail.
 */
export async function makeThumbnail(
  serveUrl: string,
  inputProps: Record<string, unknown>,
  width: number,
  height: number
): Promise<Buffer> {
  const dir = await mkdtemp(join(tmpdir(), 'vpl-thumb-'))
  const outPath = join(dir, 'thumb.png')

  try {
    const composition = await selectComposition({
      serveUrl,
      id: 'VideoProject',
      inputProps,
    })

    composition.width = width
    composition.height = height

    await renderStill({
      serveUrl,
      composition,
      output: outPath,
      frame: 1,
      imageFormat: 'png',
      inputProps,
    })
    return await readFile(outPath)
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {})
  }
}
