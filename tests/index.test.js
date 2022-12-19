import fs from 'fs'
import path from 'path'
import autocrop from '../src/index.js'

it('can crop the images', async () => {
  const images = ['image_2', 'image_5']
  // const images = ['image_1', 'image_3', 'image_4', 'image_6']
  for (let filename of images) {
    const image = fs.readFileSync(path.resolve(__dirname, `./__data__/input/${filename}.png`))
    const base64 = Buffer.from(image).toString('base64')
    const expected = await import(`./__data__/expected/${filename}`).then(r => r.default)

    const result = await autocrop(`data:image/png;base64,${base64}`)

    expect(result).toMatchObject(expected)
  }
})
