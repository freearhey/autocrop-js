import { Image } from 'image-js'
import { getBgColor, calcBoundaryBox, rgbToHex } from './util.js'

export default async function (dataURL, config = {}) {
  config = { alphaThreshold: 0, ...config }

  let _image = await Image.load(dataURL)
  _image = new Image(_image.width, _image.height, _image.getRGBAData())

  const _bgColor = getBgColor(_image)

  const [x, y, width, height] = calcBoundaryBox(_image, _bgColor, config.alphaThreshold)

  _image = _image.crop({ x, y, width, height })

  const base64 = _image.toBase64('image/png')
  const data = `data:image/png;base64,${base64}`
  const bgColor = rgbToHex(_bgColor)

  return {
    data,
    bbox: {
      x,
      y,
      width,
      height
    },
    bgColor
  }
}
