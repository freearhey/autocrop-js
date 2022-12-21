import { Image } from 'image-js'
import { calcBoundaryBox, getBgColor, removeBg, rgbToHex, getPixels, hexToRgb } from './util.js'

export default async function (dataURL, options = {}) {
  let _image = await Image.load(dataURL)
  _image = new Image(_image.width, _image.height, _image.getRGBAData())
  // console.log(_image.width, _image.height)

  const bgColorRGB = getBgColor(_image)

  const [x, y, width, height] = calcBoundaryBox(_image, bgColorRGB)
  _image = _image.crop({ x, y, width, height })
  // console.log(x, y, width, height)

  const base64 = _image.toBase64('image/png')
  const bgColorHEX = rgbToHex(bgColorRGB)

  return {
    data: `data:image/png;base64,${base64}`,
    bbox: {
      x,
      y,
      width,
      height
    },
    bgColor: bgColorHEX
  }
}
