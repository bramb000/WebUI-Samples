import type { BookPageFace } from '../../constants/alchemistBookData'
import * as THREE from 'three'
import { getStaticBookParchmentCanvas } from './bakeStaticBookParchment'
import { composeBookPageCanvas, mirrorCanvasHorizontal } from './composeBookPage'

export function readParchmentRgb(): THREE.Vector3 {
  const fill = typeof document !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue('--paper-surface-fill').trim()
    : ''
  const hex = fill.startsWith('#') ? fill : '#ebe4d6'
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const n = Number.parseInt(full, 16)
  return new THREE.Vector3(
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
  )
}

export function createBookPageTexture(
  data: BookPageFace,
  isBack: boolean,
  renderer: THREE.WebGLRenderer,
): THREE.CanvasTexture {
  const parchment = getStaticBookParchmentCanvas(renderer, readParchmentRgb())
  let composed = composeBookPageCanvas(data, parchment)

  if (isBack)
    composed = mirrorCanvasHorizontal(composed)

  const texture = new THREE.CanvasTexture(composed)
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
  texture.flipY = true
  texture.needsUpdate = true
  return texture
}
