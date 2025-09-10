export class ViewManager {
  constructor(dataManager) {
    this.dataManager = dataManager
    this.currentPage = 1
    this.rowsPerPage = 10
    this.totalPages = 0
    this.currentView = "table" // Default to table view

    // DOM elements
    this.cardsContainer = document.getElementById("posts-cards")
    this.tableContainer = document.getElementById("posts-table-body")
    this.tableWrapper = document.getElementById("posts-table-wrapper")
    this.pageInfo = document.getElementById("page-info")
    this.prevPage = document.getElementById("prev-page")
    this.nextPage = document.getElementById("next-page")
    this.sortType = document.getElementById("sort-type")
    this.sortOrder = document.getElementById("sort-order")
    this.searchInput = document.getElementById("search")
    this.size = document.getElementById("page-size")

    this.viewCardsBtn = document.getElementById("view-cards")
    this.viewTableBtn = document.getElementById("view-table")

    if (this.size) {
      this.rowsPerPage = Number.parseInt(this.size.value, 10)
    }

    this.initializeViewToggle()
  }

  initializeViewToggle() {
    if (this.viewCardsBtn && this.viewTableBtn) {
      this.viewCardsBtn.addEventListener("click", () => this.switchView("cards"))
      this.viewTableBtn.addEventListener("click", () => this.switchView("table"))
    }
  }

  switchView(viewType) {
    this.currentView = viewType

    // Update button states
    if (this.viewCardsBtn && this.viewTableBtn) {
      this.viewCardsBtn.classList.toggle("active", viewType === "cards")
      this.viewTableBtn.classList.toggle("active", viewType === "table")
    }

    // Update container visibility
    if (this.cardsContainer && this.tableWrapper) {
      this.cardsContainer.classList.toggle("active", viewType === "cards")
      this.tableWrapper.classList.toggle("active", viewType === "table")
    }

    // Re-render posts in new view
    this.refreshView()
  }

  computeView() {
    const searchQuery = this.searchInput?.value || ""
    const sortType = this.sortType?.value || "id"
    const sortOrder = this.sortOrder?.value || "ascending"

    const filtered = this.dataManager.applySearch(this.dataManager.getAllPosts(), searchQuery)
    return this.dataManager.applySort(filtered, sortType, sortOrder)
  }

  refreshView(options = {}) {
    const { resetPage = false } = options
    const view = this.computeView()
    this.totalPages = Math.max(1, Math.ceil(view.length / this.rowsPerPage))
    if (resetPage) this.currentPage = 1
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages
    this.renderPosts(view)
  }

  renderPosts(postsSource) {
    const currentContainer = this.currentView === "cards" ? this.cardsContainer : this.tableContainer
    if (!currentContainer) return

    currentContainer.innerHTML = "" // Clear existing posts

    const start = (this.currentPage - 1) * this.rowsPerPage
    const end = start + this.rowsPerPage
    const pagePosts = postsSource.slice(start, end)

    pagePosts.forEach((post) => {
      if (this.currentView === "cards") {
        // Render as card
        const card = document.createElement("div")
        card.className = "post-card"
        card.innerHTML = `
          <div class="post-card-header">
            <div class="post-card-id">#${post.id}</div>
          </div>
          <h3 class="post-card-title">${post.title}</h3>
          <p class="post-card-body">${post.body}</p>
          <div class="post-card-actions">
            <button class="edit-button action-button" data-id="${post.id}" data-action="edit">
              Edit
            </button>
            <button class="delete-button action-button" data-id="${post.id}" data-action="delete">
              Delete
            </button>
          </div>
        `
        currentContainer.appendChild(card)
      } else {
        // Render as table row
        const row = document.createElement("tr")
        row.innerHTML = `
          <td class="post-id table-data">${post.id}</td>
          <td class="post-title table-data">${post.title}</td>
          <td class="post-body table-data">${post.body}</td>
          <td class="table-actions">
           <button class="edit-button action-button" data-id="${post.id}" data-action="edit">
             Edit
           </button>
           <button class="delete-button action-button" data-id="${post.id}" data-action="delete">
             Delete
           </button>
          </td>
        `
        currentContainer.appendChild(row)
      }
    })

    const viewLength = this.computeView().length
    this.totalPages = Math.max(1, Math.ceil(viewLength / this.rowsPerPage))

    if (this.pageInfo) {
      this.pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`
    }
    if (this.prevPage) {
      this.prevPage.classList.toggle("disabled", this.currentPage === 1)
    }
    if (this.nextPage) {
      this.nextPage.classList.toggle("disabled", this.currentPage === this.totalPages || this.totalPages === 0)
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--
      this.refreshView()
      window.scrollTo(0, 0)
    }
  }

  goToNextPage() {
    const viewLength = this.computeView().length
    const maxPages = Math.max(1, Math.ceil(viewLength / this.rowsPerPage))
    if (this.currentPage < maxPages) {
      this.currentPage++
      this.refreshView()
      window.scrollTo(0, 0)
    }
  }

  updatePageSize(newSize) {
    this.rowsPerPage = Number.parseInt(newSize, 10)
    this.currentPage = 1
    this.refreshView({ resetPage: true })
  }
}
