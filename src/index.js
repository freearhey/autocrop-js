import { Image } from 'image-js'
import { createCanvas } from 'canvas'
import { calcBoundaryBox, getBgColor, removeBg, rgbToHex, getPixels, hexToRgb } from './util.js'

export default async function (dataURL, options = {}) {
  let removeBackground = options.removeBackground || false
  let colorThreshold = options.colorThreshold || 1

  let origWidth
  let origHeight
  let croppedWidth
  let croppedHeight

  let _image = await Image.load(dataURL)
  _image = new Image(_image.width, _image.height, _image.getRGBAData())

  origWidth = _image.width
  origHeight = _image.height

  let canvas = createCanvas(origWidth, origHeight)
  let bgColor = getBgColor(_image)

  if (removeBackground) {
    _image = removeBg(_image, bgColor, colorThreshold)
  }

  _image = _image.cropAlpha({ threshold: 10 })

  let [x, y, width, height] = calcBoundaryBox(_image, bgColor)
  _image = _image.crop({ x, y, width, height })

  let c = _image.getCanvas()
  let ctx = c.getContext('2d')

  canvas.width = _image.width
  canvas.height = _image.height

  croppedWidth = canvas.width
  croppedHeight = canvas.height

  return {
    data: canvas.toDataURL(),
    bbox: {
      x,
      y,
      width,
      height
    },
    bgColor
  }
}
