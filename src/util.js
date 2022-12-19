import _ from 'lodash'

export function removeBg(image, bgColor, colorThreshold) {
  let pixels = getPixels(image)

  pixels.forEach((pixel, i) => {
    let dist = deltaE(pixel.slice(0, 3), bgColor.slice(0, 3))
    if (dist < colorThreshold) {
      image.setPixel(i, [0, 0, 0, 0])
    }
  })

  return image
}

export function getBgColor(image) {
  return image.getPixel(0)
}

export function getPixels(image) {
  return _.chunk(image.getRGBAData(), 4)
}

function calcMaxColor(color) {
  let alphaThreshold = 10
  let maxIndex = 0
  let maxValue = 0
  let alpha = color[3] > alphaThreshold ? 255 : 0
  color.slice(0, 3).forEach((value, i) => {
    if (value > maxValue) {
      maxIndex = i
      maxValue = value
    }
  })

  let output = [0, 0, 0, 0]
  output[3] = alpha
  if (alpha === 255) {
    output[maxIndex] = maxValue
  }

  return output
}

export function calcBoundaryBox(image, bgColor) {
  let pixels = getPixels(image)
  let width = image.width
  let height = image.height

  // console.log('bgColor', bgColor)
  // console.log('width', width)
  // console.log('height', height)
  bgColor = calcMaxColor(bgColor)
  // console.log('maxColor', bgColor)

  pixels = pixels.map(calcMaxColor)
  // console.log('pixels0', pixels[300])

  let bgRow = Array(width).fill(Array.from(bgColor))
  // console.log('bgRow', bgRow.length)

  let bgCol = Array(height).fill(Array.from(bgColor))
  // console.log('bgCol', bgCol.length)

  let rows = _.chunk(pixels, width)
  // console.log('rows', rows.length)
  // console.log('firstRow', rows[0])
  // console.log('lastRow', rows[rows.length - 1])

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
  // console.log('cols', cols.length)
  // console.log('firstCol', cols[0])
  // console.log('lastCol', cols[cols.length - 1])

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

  // console.log('y1', y1)

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

  // console.log('y2', y2)

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

  // console.log('x1', x1)

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

  // console.log('x2', x2)

  let newHeight = y2 - y1
  let newWidth = x2 - x1

  // console.log('newWidth', newWidth)
  // console.log('newHeight', newHeight)

  if (!newWidth || !newHeight) return [0, 0, width, height]

  return [x1, y1, newWidth, newHeight]
}

function deltaE(rgbA, rgbB) {
  let labA = rgb2lab(rgbA)
  let labB = rgb2lab(rgbB)
  let deltaL = labA[0] - labB[0]
  let deltaA = labA[1] - labB[1]
  let deltaB = labA[2] - labB[2]
  let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2])
  let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2])
  let deltaC = c1 - c2
  let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH)
  let sc = 1.0 + 0.045 * c1
  let sh = 1.0 + 0.015 * c1
  let deltaLKlsl = deltaL / 1.0
  let deltaCkcsc = deltaC / sc
  let deltaHkhsh = deltaH / sh
  let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh
  return i < 0 ? 0 : Math.sqrt(i)
}

function rgb2lab(rgb) {
  let r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255,
    x,
    y,
    z
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92
  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883
  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)]
}

function componentToHex(c) {
  var hex = c.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}

export function rgbToHex(color) {
  let [r, g, b] = color

  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}
