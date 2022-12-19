import fs from 'fs'
import path from 'path'
import autocrop from '../src/index.js'

it('can crop the images', async () => {
  for (let filename of ['image_1', 'image_2', 'image_3', 'image_4', 'image_5', 'image_6']) {
    const image = fs.readFileSync(path.resolve(__dirname, `./__data__/input/${filename}.png`))
    const base64 = Buffer.from(image).toString('base64')
    const expected = await import(`./__data__/expected/${filename}`).then(r => r.default)

    const result = await autocrop(`data:image/png;base64,${base64}`)

    expect(result.data).toBe(expected.data)
    expect(result.bbox).toMatchObject(expected.bbox)
    expect(result.bgColor).toBe(expected.bgColor)
  }
})
