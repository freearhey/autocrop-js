import { Image } from 'image-js'
import { calcBoundaryBox, getBgColor, removeBg, rgbToHex, getPixels, hexToRgb } from './util.js'

export default async function (dataURL, config = {}) {
  config = { threshold: 0, alphaThreshold: 0, backgroundColor: null, ...config }

  let _image = await Image.load(dataURL)
  _image = new Image(_image.width, _image.height, _image.getRGBAData())

  const _bgColor = config.backgroundColor ? hexToRgb(config.backgroundColor) : getBgColor(_image)
  console.log(_bgColor)

  const [x, y, width, height] = calcBoundaryBox(
    _image,
    _bgColor,
    config.threshold,
    config.alphaThreshold
  )

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
