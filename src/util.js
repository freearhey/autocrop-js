import _ from 'lodash'

export function calcBoundaryBox(image, alphaThreshold) {
  let pixels = getPixels(image)
  let width = image.width
  let height = image.height

  pixels = pixels.map(p => {
    p = calcMaxColor(p, alphaThreshold)

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

function getPixels(image) {
  return _.chunk(image.getRGBAData(), 4)
}

function calcMaxColor(color, alphaThreshold = 0) {
  if (color[3] <= alphaThreshold) return [0, 0, 0, 0]

  return color
}
