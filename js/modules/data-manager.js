let posts = []
const API_URL = "https://jsonplaceholder.typicode.com/posts"

export async function fetchPosts() {
  try {
    const response = await fetch(API_URL)
    const data = await response.json()
    posts = data
    return data
  } catch (err) {
    const errorEl = document.getElementById("error")
    if (errorEl) {
      errorEl.style.display = "block"
      errorEl.textContent = "Error fetching posts"
    }
    console.error("Error fetching posts:", err)
    throw err
  } finally {
    const loading = document.getElementById("loading")
    const postsBody = document.getElementById("postsBody")
    if (loading) loading.style.display = "none"
    if (postsBody) postsBody.classList.remove("hide")
  }
}

export function addPost(title, body) {
  const maxId = posts.length ? Math.max(...posts.map((p) => p.id)) : 0
  const newPost = { id: maxId + 1, title, body }
  posts.unshift(newPost)
  return newPost
}

export function updatePost(id, title, body) {
  posts = posts.map((p) => (p.id === id ? { ...p, title, body } : p))
}

export function deletePost(id) {
  posts = posts.filter((post) => post.id !== id)
}

export function getPost(id) {
  return posts.find((p) => p.id === id)
}

export function getAllPosts() {
  return [...posts]
}

export function applySearch(source, query) {
  const q = (query || "").toLowerCase()
  if (!q) return [...source]
  return source.filter((p) => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q))
}

export function applySort(source, type = "id", order = "ascending") {
  return [...source].sort((a, b) => {
    if (typeof a[type] === "number") {
      return order === "ascending" ? a[type] - b[type] : b[type] - a[type]
    }
    if (typeof a[type] === "string") {
      return order === "ascending" ? a[type].localeCompare(b[type]) : b[type].localeCompare(a[type])
    }
    return 0
  })
}

export class PostsDataManager {
  constructor() {
    // All methods are bound to the functional implementations
  }

  async fetchPosts() {
    return await fetchPosts()
  }

  addPost(title, body) {
    return addPost(title, body)
  }

  updatePost(id, title, body) {
    return updatePost(id, title, body)
  }

  deletePost(id) {
    return deletePost(id)
  }

  getPost(id) {
    return getPost(id)
  }

  getAllPosts() {
    return getAllPosts()
  }

  applySearch(source, query) {
    return applySearch(source, query)
  }

  applySort(source, type, order) {
    return applySort(source, type, order)
  }
}
