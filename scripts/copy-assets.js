const fs = require('fs')
const path = require('path')

// Copy clock face images to out directory for GitHub Pages
const publicDir = path.join(__dirname, '..', 'public')
const outDir = path.join(__dirname, '..', 'out')

const imagesToCopy = [
  'sun-clock-face.png',
  'cute-animal-clock-face.png'
]

imagesToCopy.forEach(image => {
  const src = path.join(publicDir, image)
  const dest = path.join(outDir, image)
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    console.log(`Copied ${image} to out directory`)
  } else {
    console.warn(`Warning: ${image} not found in public directory`)
  }
})