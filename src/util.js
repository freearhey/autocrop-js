import _ from 'lodash'

function calcMaxColor(color, threshold = 0, alphaThreshold = 0) {
  if (color[3] <= alphaThreshold) return [0, 0, 0, 0]

  return color.map(value => {
    if (value === 0) return 0
    const mod = (value + 1) % (threshold + 1)
    value = value + (threshold - mod)
    value = value > 255 ? 255 : value

    return value
  })
}

function removeBg(pixel, bgColor) {
  return JSON.stringify(pixel) === JSON.stringify(bgColor) ? [0, 0, 0, 0] : pixel
}

export function calcBoundaryBox(image, bgColor, threshold, alphaThreshold) {
  let pixels = getPixels(image)
  let width = image.width
  let height = image.height

  let maxColor = calcMaxColor(bgColor, threshold, alphaThreshold)

  pixels = pixels.map(p => {
    p = calcMaxColor(p, threshold, alphaThreshold)
    p = removeBg(p, maxColor)

    return p
  })

  const bgRow = Array(width).fill(Array.from([0, 0, 0, 0]))

  const bgCol = Array(height).fill(Array.from([0, 0, 0, 0]))

  let rows = _.chunk(pixels, width)

  let cols = []
  Array(width)
    .fill(0)
    .map((el, i) => {
      let col = []

      rows.forEach(row => {
        col.push(row[i])
      })

      cols.push(col)
    })

  let y1
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i]
    if (!y1) {
      if (JSON.stringify(row) !== JSON.stringify(bgRow)) {
        y1 = i
        break
      }
    }
  }

  let y2
  for (let i = rows.length - 1; i > -1; i--) {
    let row = rows[i]
    if (!y2) {
      if (JSON.stringify(row) !== JSON.stringify(bgRow)) {
        y2 = i + 1
        break
      }
    }
  }

  let x1
  for (let i = 0; i < cols.length; i++) {
    let col = cols[i]
    if (!x1) {
      if (JSON.stringify(col) !== JSON.stringify(bgCol)) {
        x1 = i
        break
      }
    }
  }

  let x2
  for (let i = cols.length - 1; i > -1; i--) {
    let col = cols[i]
    if (!x2) {
      if (JSON.stringify(col) !== JSON.stringify(bgCol)) {
        x2 = i + 1
        break
      }
    }
  }

  let newHeight = y2 - y1
  let newWidth = x2 - x1

  if (!newWidth || !newHeight) return [0, 0, width, height]

  return [x1, y1, newWidth, newHeight]
}

export function getBgColor(image) {
  return image.getPixel(0)
}

export function getPixels(image) {
  return _.chunk(image.getRGBAData(), 4)
}

export function rgbToHex(color) {
  let [r, g, b] = color

  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 255]
    : null
}

function componentToHex(c) {
  var hex = c.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}
