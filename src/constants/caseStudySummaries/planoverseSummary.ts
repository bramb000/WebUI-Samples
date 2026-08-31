import type { CaseStudySummaryData } from '../../types/caseStudySummary'
import macroStoreMap from '../../assets/images/planoverse/macro-store-map.png'
import bayComparisonCanned from '../../assets/images/planoverse/bay-comparison-canned-overview.png'
import bayShareMethodology from '../../assets/images/planoverse/bay-share-methodology.png'
import bayComparisonPasta from '../../assets/images/planoverse/bay-comparison-pasta.png'
import colesAisleStock from '../../assets/images/planoverse/coles-aisle-stock.jpg'
import woolworthsAisleStock from '../../assets/images/planoverse/woolworths-aisle-stock.jpg'

export const planoverseSummary: CaseStudySummaryData = {
  metrics: [
    { value: 'More actionable data', label: 'than any other competitor product', theme: 'after' },
    { value: '85% Satisfaction Score', label: 'by external stakeholders', theme: 'after' },
  ],
  beats: [
    {
      kicker: '01 · Problem',
      text: 'Category managers still rely on <strong>1–2 discreet store visits a year</strong> to guess what competitors stock, promote, and display. There is no structured weekly data.',
    },
    {
      kicker: '02 · Approach',
      text: 'Woolworths and Coles already expose in-store assortment, stock status, and aisle coordinates inside their <strong>mobile apps</strong>. I built a pipeline to retrieve it daily and match SKUs across banners.',
    },
    {
      kicker: '03 · Outcome',
      text: 'An 8-week pilot turned that API data into shelf intelligence executives could act on: bay share, adjacency, and range <strong>store to store</strong>. Woolworths signed after the pilot.',
    },
  ],
  featureClip: {
    kind: 'image',
    src: macroStoreMap,
    title: 'Coles vs Woolworths macro store map',
  },
  processBoard: [
    { src: bayComparisonCanned, alt: 'Bay comparison for canned food', x: 18, y: 22, rotate: -5, scale: 0.86, zIndex: 3 },
    { src: bayShareMethodology, alt: 'Bay share calculation methodology', x: 72, y: 18, rotate: 4, scale: 0.82, zIndex: 2 },
    { src: colesAisleStock, alt: 'Coles supermarket aisle', x: 12, y: 68, rotate: -7, scale: 0.78, zIndex: 4 },
    { src: woolworthsAisleStock, alt: 'Woolworths supermarket aisle', x: 88, y: 62, rotate: 6, scale: 0.76, zIndex: 3 },
    { src: bayComparisonPasta, alt: 'Pasta bay comparison with stakeholder notes', x: 48, y: 58, rotate: -2, scale: 0.88, zIndex: 5 },
  ],
}
