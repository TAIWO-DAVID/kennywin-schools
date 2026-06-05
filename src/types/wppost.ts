export default interface WPPost {
  id: number
  jetpack_featured_media_url: string
  slug: string
  title: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  date: string
  categories: string
}