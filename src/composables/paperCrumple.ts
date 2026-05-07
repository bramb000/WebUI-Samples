let crumpleAnimId: number | null = null
let currentCrumple = 0

function getEls() {
  const map = document.getElementById('crumple-map') as SVGFEDisplacementMapElement | null
  const noise = document.getElementById('crumple-noise') as SVGFETurbulenceElement | null
  return { map, noise }
}

export function startCrumple() {
  const { map, noise } = getEls()
  if (!map || !noise) return

  if (crumpleAnimId != null) cancelAnimationFrame(crumpleAnimId)

  const randomSeed = Math.floor(Math.random() * 1000)
  noise.setAttribute('seed', String(randomSeed))

  const targetIntensity = 25 + Math.random() * 20
  currentCrumple = targetIntensity
  const decaySpeed = 0.05 + Math.random() * 0.05

  const animateCrumple = () => {
    currentCrumple += (0 - currentCrumple) * decaySpeed
    map.setAttribute('scale', String(currentCrumple))

    if (currentCrumple > 0.5) {
      crumpleAnimId = requestAnimationFrame(animateCrumple)
    } else {
      map.setAttribute('scale', '0')
      crumpleAnimId = null
    }
  }

  animateCrumple()
}

