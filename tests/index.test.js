import fs from 'fs'
import path from 'path'
import autocrop from '../src/index.js'

const images = ['image_1', 'image_2', 'image_3', 'image_4', 'image_5', 'image_6']

describe('can crop the images without config', () => {
  test.concurrent.each(images)('%s', async filename => {
    let base64 = loadImage(`${filename}.png`)
    let expected = await loadExpected(`test1/${filename}`)
    let result = await autocrop(`data:image/png;base64,${base64}`)

    expect(result).toMatchObject(expected)
  })
})

describe('can crop the images with config.alphaThreshold = 10', () => {
  test.concurrent.each(images)('%s', async filename => {
    let base64 = loadImage(`${filename}.png`)
    let expected = await loadExpected(`test2/${filename}`)
    let result = await autocrop(`data:image/png;base64,${base64}`, { alphaThreshold: 10 })

    expect(result).toMatchObject(expected)
  })
})

function loadImage(filename) {
  const image = fs.readFileSync(path.resolve(__dirname, `./__data__/images/${filename}`))

  return Buffer.from(image).toString('base64')
}

function loadExpected(filepath) {
  return import(`./__data__/expected/${filepath}`).then(r => r.default)
}
