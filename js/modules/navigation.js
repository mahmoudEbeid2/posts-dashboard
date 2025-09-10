export class NavigationManager {
  constructor() {
    // DOM elements
    this.postsWrapper = document.getElementById("posts-wrapper")
    this.filters = document.getElementById("filters")
    this.addPostSection = document.getElementById("add-post-section")
    this.editPostSection = document.getElementById("edit-post-section")
    this.menuPosts = document.getElementById("menu-posts")
    this.menuAddPost = document.getElementById("menu-add-post")
  }

  setMenuActive(isPosts) {
    if (!this.menuPosts || !this.menuAddPost) return

    if (isPosts) {
      this.menuPosts.classList.add("active")
      this.menuAddPost.classList.remove("active")
    } else {
      this.menuPosts.classList.remove("active")
      this.menuAddPost.classList.add("active")
    }
  }

  showPostsList() {
    if (this.postsWrapper) this.postsWrapper.classList.remove("hide")
    if (this.filters) this.filters.classList.remove("hide")
    if (this.addPostSection) this.addPostSection.classList.add("hide")
    if (this.editPostSection) this.editPostSection.classList.add("hide")
    this.setMenuActive(true)
  }

  showAddPostForm() {
    if (this.postsWrapper) this.postsWrapper.classList.add("hide")
    if (this.filters) this.filters.classList.add("hide")
    if (this.editPostSection) this.editPostSection.classList.add("hide")
    if (this.addPostSection) this.addPostSection.classList.remove("hide")
    this.setMenuActive(false)
  }

  showEditPostForm() {
    // Keep posts list visible in the background
    if (this.postsWrapper) this.postsWrapper.classList.remove("hide")
    if (this.filters) this.filters.classList.remove("hide")
    // Hide add form if open
    if (this.addPostSection) this.addPostSection.classList.add("hide")
    // Do not show inline edit section; we use modal
    if (this.editPostSection) this.editPostSection.classList.add("hide")
    // Highlight Posts in sidebar (not Add)
    this.setMenuActive(true)
  }

  forceShowPosts() {
    this.setMenuActive(true)
    if (this.postsWrapper) this.postsWrapper.classList.remove("hide")
    if (this.filters) this.filters.classList.remove("hide")
    if (this.addPostSection) this.addPostSection.classList.add("hide")
  }
}
