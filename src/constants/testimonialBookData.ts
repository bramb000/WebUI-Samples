import type { BookCoverPage, BookLeaf } from './alchemistBookData'

export type TestimonialEntry = {
  name: string
  role: string
  quote: string
}

/** Home testimonial book — order: Kaiwen, Tianhao, Hiroshi, Jill */
export const TESTIMONIAL_BOOK_ENTRIES: TestimonialEntry[] = [
  {
    name: 'Kaiwen Young',
    role: 'Director of User Experience, Ubisoft',
    quote:
      'Bramha\'s passion, knowledge and communication style contributed greatly to the quality of our project and team culture.',
  },
  {
    name: 'Tianhao Kang',
    role: 'CTO, Mineloader Studios',
    quote:
      'Bramha thrives in cross-functional teams, translating data insights into actionable design, analytics and improvements. His results-focused, data-led mindset elevates the project, while his open communication style fosters trust and efficiency among teammates.',
  },
  {
    name: 'Hiroshi Ogawa',
    role: 'Lead UI Engineer, Ubisoft',
    quote:
      'His knowledge and insight always pushed our discussion forward. A clear design-based dialogue was productive and helpful in the cross-studio project in Japan and India. I respect his courage to accept the change, which is UX/UI design\'s most challenging part of improving the game while managing our resources.',
  },
  {
    name: 'Jill Priya Keshyap',
    role: 'Head of Product, Immutable',
    quote:
      'The combination of hands-on product thinking, strong technical intuition, and elegant design is extremely hard to find. It makes Bramha the go to person for cross-functional teams',
  },
]

export const TESTIMONIAL_BOOK_COVER: BookCoverPage = {
  header: 'Testimonials',
}

/** One leaf per testimonial — quote on front, empty back */
export const TESTIMONIAL_BOOK_LEAVES: BookLeaf[] = TESTIMONIAL_BOOK_ENTRIES.map(
  (entry) => ({
    front: {
      layout: 'right',
      body: entry.quote,
      attribution: `${entry.name}\n${entry.role}`,
    },
    back: { layout: 'empty' },
  }),
)
