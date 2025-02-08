export interface AnimeRes {
  mal_id: number
  url: string
  titles: {
    type: string
    title: string
  }[]
  images: {
    jpg: {
      image_url: string
    }

    webp: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
  }
  type: string
  episodes: number
  status: string
  score: number
  synopsis: string
  year: number
  genres: {
    mal_id: number
    type: string
    name: string
    url: string
  }[]
  explicit_genres: {
    mal_id: number
    type: string
    name: string
    url: string
  }[]
  demographics: {
    mal_id: number
    type: string
    name: string
    url: string
  }[]
}

export interface Pagination {
  last_visible_page: number
  has_next_page: boolean
  current_page: number
}

export interface MyAnimeData {
  mal_id: number
  url: string
  title: string
  image: string
  type: string
  episodes: number
  status: string
  score: number
  synopsis: string
  year: number
  genres: string
  demographics: string
}
