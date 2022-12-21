import { Image } from 'image-js'
import { getBgColor, calcBoundaryBox, rgbToHex } from './util.js'

export default async function (input, config = {}) {
  config = { alphaThreshold: 0, ...config }

  let _image = await Image.load(input)
  _image = new Image(_image.width, _image.height, _image.getRGBAData())

  const _bgColor = getBgColor(_image)

  const [x, y, width, height] = calcBoundaryBox(_image, _bgColor, config.alphaThreshold)

  _image = _image.crop({ x, y, width, height })

  const bgColor = rgbToHex(_bgColor)
  const base64 = _image.toBase64('image/png')
  const dataURL = `data:image/png;base64,${base64}`

  return {
    bbox: {
      x,
      y,
      width,
      height
    },
    bgColor,
    dataURL
  }
}
