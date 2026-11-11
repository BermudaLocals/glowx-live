import fs from 'fs'
import path from 'path'

const DATA_DIR = process.env.GLOWX_DATA_DIR || path.join(process.cwd(), 'data')
const POSTS_FILE = path.join(DATA_DIR, 'posts.json')

export type Post = {
  id: string
  author: string
  text: string
  images: string[]
  isAi: boolean
  createdAt: string
}

export function readPosts(): Post[] {
  try {
    const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'))
    return Array.isArray(posts) ? posts : []
  } catch {
    return []
  }
}

function writePosts(posts: Post[]) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2))
}

export function addPost(post: Post): Post {
  const posts = readPosts()
  posts.unshift(post)
  writePosts(posts)
  return post
}

export function deletePost(id: string): Post | null {
  const posts = readPosts()
  const idx = posts.findIndex(p => p.id === id)
  if (idx === -1) return null
  const [removed] = posts.splice(idx, 1)
  writePosts(posts)
  return removed
}
