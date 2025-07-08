const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export const CLOCK_FACES = {
  sun: {
    src: `${basePath}/clock-faces/clock-face-sun.png`,
    label: 'Sun',
  },
  animal: {
    src: `${basePath}/clock-faces/clock-face-cute-animal.png`,
    label: 'Cute Animal',
  },
  sportsCar: {
    src: `${basePath}/clock-faces/clock-face-sports-car.png`,
    label: 'Sports Car',
  },
  bomb:      { src: `${basePath}/clock-faces/clock-face-bomb.png`,           label: 'Bomb' },
  ninja:     { src: `${basePath}/clock-faces/clock-face-ninja.png`,          label: 'Ninja' },
  submarine: { src: `${basePath}/clock-faces/clock-face-submarine.png`,      label: 'Submarine' },
  cyberpunk: { src: `${basePath}/clock-faces/clock-face-cyberpunk.png`,      label: 'Cyberpunk' },
  sportsStadium:{ src: `${basePath}/clock-faces/clock-face-sports-stadium.png`, label: 'Sports Stadium' },
  jungle:    { src: `${basePath}/clock-faces/clock-face-jungle.png`,         label: 'Jungle' },
  magicalForest:{ src: `${basePath}/clock-faces/clock-face-magical-forest.png`, label: 'Magical Forest' },
  dreamySky: { src: `${basePath}/clock-faces/clock-face-dreamy-sky.png`,     label: 'Dreamy Sky' },
  mermaids:  { src: `${basePath}/clock-faces/clock-face-mermaids.png`,       label: 'Mermaids' },
  rainbowCastle:{ src: `${basePath}/clock-faces/clock-face-rainbow-castle.png`, label: 'Rainbow Castle' },
  cuteRocket:{ src: `${basePath}/clock-faces/clock-face-cute-rocket.png`,    label: 'Cute Rocket' },
  cupcakesDonuts:{ src: `${basePath}/clock-faces/clock-face-cupcakes-donuts.png`, label: 'Cupcakes & Donuts' },
  unicorn:   { src: `${basePath}/clock-faces/clock-face-unicorn.png`,        label: 'Unicorn' },
  animalBedroom:{ src: `${basePath}/clock-faces/clock-face-animal-bedroom.png`, label: 'Animal Bedroom' },
  gardenButterflies:{ src: `${basePath}/clock-faces/clock-face-garden-butterflies.png`, label: 'Garden Butterflies' },
} as const

export type ClockFaceKey = keyof typeof CLOCK_FACES 