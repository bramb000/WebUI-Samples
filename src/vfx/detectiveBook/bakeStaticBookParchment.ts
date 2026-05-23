import * as THREE from 'three'
import { DETECTIVE_BOOK_PARCHMENT_BAKE_FRAGMENT, PARCHMENT_BAKE_VERTEX } from './detectiveBookShaders'

const BAKE_W = 512
const BAKE_H = 768
const PAGE_ASPECT = 320 / 480

let cachedParchment: HTMLCanvasElement | null = null

/**
 * One-time GPU bake of deckled parchment (no text). Shared by all book pages.
 */
export function getStaticBookParchmentCanvas(
  renderer: THREE.WebGLRenderer,
  parchmentRgb: THREE.Vector3,
): HTMLCanvasElement {
  if (cachedParchment)
    return cachedParchment

  const bakeScene = new THREE.Scene()
  const bakeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const bakeMat = new THREE.ShaderMaterial({
    vertexShader: PARCHMENT_BAKE_VERTEX,
    fragmentShader: DETECTIVE_BOOK_PARCHMENT_BAKE_FRAGMENT,
    uniforms: {
      u_aspect: { value: PAGE_ASPECT },
      u_parchmentRgb: { value: parchmentRgb.clone() },
    },
    transparent: true,
    depthWrite: false,
  })
  const bakeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bakeMat)
  bakeScene.add(bakeMesh)

  const rt = new THREE.WebGLRenderTarget(BAKE_W, BAKE_H, {
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    depthBuffer: false,
    stencilBuffer: false,
  })

  const prevTarget = renderer.getRenderTarget()
  const prevClear = renderer.getClearColor(new THREE.Color())
  const prevClearAlpha = renderer.getClearAlpha()

  renderer.setRenderTarget(rt)
  renderer.setClearColor(0x000000, 0)
  renderer.clear()
  renderer.render(bakeScene, bakeCamera)

  const pixels = new Uint8Array(BAKE_W * BAKE_H * 4)
  renderer.readRenderTargetPixels(rt, 0, 0, BAKE_W, BAKE_H, pixels)

  renderer.setRenderTarget(prevTarget)
  renderer.setClearColor(prevClear, prevClearAlpha)

  const canvas = document.createElement('canvas')
  canvas.width = BAKE_W
  canvas.height = BAKE_H
  const ctx = canvas.getContext('2d')
  if (!ctx)
    throw new Error('Could not create parchment bake canvas')

  const imageData = ctx.createImageData(BAKE_W, BAKE_H)
  for (let y = 0; y < BAKE_H; y++) {
    for (let x = 0; x < BAKE_W; x++) {
      const srcY = BAKE_H - 1 - y
      const srcI = (srcY * BAKE_W + x) * 4
      const dstI = (y * BAKE_W + x) * 4
      imageData.data[dstI] = pixels[srcI]!
      imageData.data[dstI + 1] = pixels[srcI + 1]!
      imageData.data[dstI + 2] = pixels[srcI + 2]!
      imageData.data[dstI + 3] = pixels[srcI + 3]!
    }
  }
  ctx.putImageData(imageData, 0, 0)

  rt.dispose()
  bakeMat.dispose()
  bakeMesh.geometry.dispose()

  cachedParchment = canvas
  return canvas
}

/** Clear singleton when disposing the book scene (e.g. theme change). */
export function disposeStaticBookParchmentCache() {
  cachedParchment = null
}
