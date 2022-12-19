import fs from 'fs'
import path from 'path'
import autocrop from '../src/index.js'

it('can crop the image 1', async () => {
  let base64 = loadImage('image_1.png')
  let expected = await loadExpected('image_1')
  let result = await autocrop(`data:image/png;base64,${base64}`)

  expect(result).toMatchObject(expected)
})

it('can crop the image 2', async () => {
  let base64 = loadImage('image_2.png')
  let expected = await loadExpected('image_2')
  let result = await autocrop(`data:image/png;base64,${base64}`)

  expect(result).toMatchObject(expected)
})

it('can crop the image 3', async () => {
  let base64 = loadImage('image_3.png')
  let expected = await loadExpected('image_3')
  let result = await autocrop(`data:image/png;base64,${base64}`)

  expect(result).toMatchObject(expected)
})

it('can crop the image 4', async () => {
  let base64 = loadImage('image_4.png')
  let expected = await loadExpected('image_4')
  let result = await autocrop(`data:image/png;base64,${base64}`)

  expect(result).toMatchObject(expected)
})

fit('can crop the image 5', async () => {
  let base64 = loadImage('image_5.png')
  let expected = await loadExpected('image_5')
  let result = await autocrop(`data:image/png;base64,${base64}`)

  expect(result).toMatchObject(expected)
})

it('can crop the image 6', async () => {
  let base64 = loadImage('image_6.png')
  let expected = await loadExpected('image_6')
  let result = await autocrop(`data:image/png;base64,${base64}`)

  expect(result).toMatchObject(expected)
})

function loadImage(filename) {
  const image = fs.readFileSync(path.resolve(__dirname, `./__data__/input/${filename}`))

  return Buffer.from(image).toString('base64')
}

function loadExpected(filename) {
  return import(`./__data__/expected/${filename}`).then(r => r.default)
}
