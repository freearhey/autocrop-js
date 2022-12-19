import fs from 'fs'
import path from 'path'
import autocrop from '../src/index.js'

it('can crop the image 1', async () => {
  const image = fs.readFileSync(path.resolve(__dirname, './__data__/input/image_1.png'))
  const base64 = Buffer.from(image).toString('base64')
  const expected = await import('./__data__/expected/image_1').then(r => r.default)

  const result = await autocrop(`data:image/png;base64,${base64}`)

  expect(result.data).toBe(expected.data)
  expect(result.bbox).toBe(expected.bbox)
  expect(result.bgColor).toBe(expected.bgColor)
})
