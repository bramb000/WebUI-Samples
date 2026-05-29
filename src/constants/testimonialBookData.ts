import type { BookCoverPage, BookLeaf } from './alchemistBookData'

export type TestimonialEntry = {
  name: string
  role: string
  quote: string
}

/** Home testimonial book — order: Chris Clay, Kaiwen, Hiroshi, Dan */
export const TESTIMONIAL_BOOK_ENTRIES: TestimonialEntry[] = [
  {
    name: 'Chris Clay',
    role: 'VP of Design, Immutable',
    quote:
      'If there was a challenge that needed solving, Bramha was always willing to step in and try to solve it with curiosity, grit, and determination. If you\'re looking for someone who will challenge the status quo, ask the right questions, and search for the best answers, Bramha is someone I\'d recommend.',
  },
  {
    name: 'Kaiwen Young',
    role: 'Director of User Experience, Ubisoft',
    quote:
      'Bramha\'s passion, knowledge and communication style contributed greatly to the quality of our project and team UX culture.',
  },
  {
    name: 'Hiroshi Ogawa',
    role: 'Lead UI Engineer, Ubisoft',
    quote:
      'Bramha made the foundation of Multi-platform UI, which was one of the biggest challenges in the project. His knowledge and insight always pushed our discussion forward. A clear design-based dialogue was productive and helpful in the cross-studio project in Japan and India. I respect his courage to accept the change, which is UX/UI design\'s most challenging part of improving the game while managing our resources.',
  },
  {
    name: 'Daniel Paez',
    role: 'VP of Revenue, Immutable',
    quote:
      'Bramha was always able to breakdown each design decision into its core target audiences and their motivations, helping cut through the franticness and rash decision-making and driving towards elegant, effective solutions.',
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
