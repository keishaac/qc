const path = require('path')
const fs = require('fs')

// Emoji images are pre-rendered PNGs (base64) drawn onto the canvas via
// drawImage(), because node-canvas cannot render color emoji glyphs from a
// font (Cairo/Pango have no COLR/sbix support). Only the Apple style ships
// here — it's the only one the app renders — kept as a single, size-optimized
// JSON file (128-color palette PNGs) instead of the old per-brand set.
const emojiJsonFile = path.resolve(__dirname, '../assets/emoji/emoji-apple-image.json')

let emojiImage = {}

try {
  if (fs.existsSync(emojiJsonFile)) emojiImage = require(emojiJsonFile)
} catch (error) {
  console.error('failed to load emoji image data:', error)
}

module.exports = emojiImage
