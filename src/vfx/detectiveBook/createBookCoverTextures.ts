import type { BookPageLeft } from '../../constants/alchemistBookData'
import * as THREE from 'three'
import {
  composeBackCoverExteriorCanvas,
  composeCoverInteriorCanvas,
  composeFrontCoverExteriorCanvas,
  composePageEdgeCanvas,
  composeSpineCanvas,
} from './composeBookCover'

function canvasToTexture(
  canvas: HTMLCanvasElement,
  renderer: THREE.WebGLRenderer,
): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
  texture.flipY = true
  texture.needsUpdate = true
  return texture
}

function leatherMaterial(texture: THREE.Texture): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    map: texture,
    transparent: false,
    depthTest: true,
    depthWrite: true,
  })
}

export type BookCoverTextures = {
  frontExterior: THREE.Texture
  frontInterior: THREE.Texture
  backExterior: THREE.Texture
  backInterior: THREE.Texture
  spineOuter: THREE.Texture
  spineInner: THREE.Texture
  boardEdge: THREE.Texture
  pageEdge: THREE.Texture
}

export function createBookCoverTextures(
  coverPage: BookPageLeft,
  renderer: THREE.WebGLRenderer,
): BookCoverTextures {
  const frontExterior = canvasToTexture(composeFrontCoverExteriorCanvas(coverPage), renderer)
  const frontInterior = canvasToTexture(composeCoverInteriorCanvas(), renderer)
  const backExterior = canvasToTexture(composeBackCoverExteriorCanvas(), renderer)
  const backInterior = canvasToTexture(composeCoverInteriorCanvas(), renderer)
  const spineOuter = canvasToTexture(
    composeSpineCanvas(coverPage.header ?? ''),
    renderer,
  )
  const spineInner = canvasToTexture(composeCoverInteriorCanvas(), renderer)
  const boardEdge = canvasToTexture(composePageEdgeCanvas(), renderer)
  const pageEdge = canvasToTexture(composePageEdgeCanvas(), renderer)

  return {
    frontExterior,
    frontInterior,
    backExterior,
    backInterior,
    spineOuter,
    spineInner,
    boardEdge,
    pageEdge,
  }
}

/**
 * Box face order (Three.js): +x, -x, +y, -y, +z, -z
 * Board hinge on -x; exterior front is +z when closed.
 */
export function createFrontCoverMaterials(textures: BookCoverTextures): THREE.MeshBasicMaterial[] {
  const edge = leatherMaterial(textures.boardEdge)
  return [
    leatherMaterial(textures.boardEdge), // +x fore-edge
    leatherMaterial(textures.boardEdge), // -x hinge
    edge, // +y
    edge, // -y
    leatherMaterial(textures.frontExterior), // +z exterior
    leatherMaterial(textures.frontInterior), // -z interior
  ]
}

export function createBackCoverMaterials(textures: BookCoverTextures): THREE.MeshBasicMaterial[] {
  const edge = leatherMaterial(textures.boardEdge)
  return [
    leatherMaterial(textures.boardEdge),
    leatherMaterial(textures.boardEdge),
    edge,
    edge,
    leatherMaterial(textures.backInterior), // +z faces into book block
    leatherMaterial(textures.backExterior), // -z exterior back
  ]
}

export function createSpineMaterials(textures: BookCoverTextures): THREE.MeshBasicMaterial[] {
  const edge = leatherMaterial(textures.boardEdge)
  return [
    leatherMaterial(textures.spineInner), // +x into boards
    leatherMaterial(textures.spineOuter), // -x outer spine
    edge,
    edge,
    edge,
    edge,
  ]
}

export function createPageBlockMaterials(textures: BookCoverTextures): THREE.MeshBasicMaterial[] {
  const edge = leatherMaterial(textures.pageEdge)
  const paper = leatherMaterial(textures.pageEdge)
  return [
    edge, // +x fore-edge
    edge, // -x spine side
    paper,
    paper,
    paper,
    paper,
  ]
}

export function disposeBookCoverTextures(textures: BookCoverTextures) {
  for (const tex of Object.values(textures))
    tex.dispose()
}
