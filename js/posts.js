import { isUserLoggedIn, logout } from "./utilities.js"
import { showToast, initializeSidebar, initializeModal } from "./modules/ui-utils.js"
import { clearValidation, validateFormGeneric, createAddFormValidator } from "./modules/form-validation.js"
import {
  fetchPosts,
  addPost,
  updatePost,
  deletePost,
  getPost,
  getAllPosts,
  applySearch,
  applySort,
} from "./modules/data-manager.js"
import { ViewManager } from "./modules/view-manager.js"
import { NavigationManager } from "./modules/navigation.js"

// Check if user is logged in
if (!isUserLoggedIn()) {
  window.location.href = "login.html"
}

// Initialize managers
const viewManager = new ViewManager({
  fetchPosts,
  addPost,
  updatePost,
  deletePost,
  getPost,
  getAllPosts,
  applySearch,
  applySort,
})
const navigationManager = new NavigationManager()

// Initialize UI components
const { closeSidebar } = initializeSidebar()
const { openEditModal, closeEditModal } = initializeModal()

const logoutButton = document.querySelector(".logout-button")
if (logoutButton) {
  logoutButton.addEventListener("click", (e) => {
    e.preventDefault()
    const confirmLogout = confirm("Are you sure you want to logout?")
    if (confirmLogout) {
      logout()
    }
  })
}

// State variables
let editPostId = null // null => create mode; number => edit mode

// Form elements
const addPostForm = document.getElementById("add-post-form")
const titleInput = document.getElementById("title")
const titleHint = document.getElementById("title-hint")
const bodyInput = document.getElementById("body")
const bodyHint = document.getElementById("body-hint")
const formMessage = document.getElementById("form-message")
const cancelButton = document.getElementById("add-cancel")
const submitButton = addPostForm ? addPostForm.querySelector(".submit-button") : null

const editForm = document.getElementById("edit-post-form")
const editTitleInput = document.getElementById("edit-title")
const editTitleHint = document.getElementById("edit-title-hint")
const editBodyInput = document.getElementById("edit-body")
const editBodyHint = document.getElementById("edit-body-hint")
const editFormMessage = document.getElementById("edit-form-message")
const editCancelButton = document.getElementById("edit-cancel")
const editSubmitButton = editForm ? editForm.querySelector(".submit-button") : null

// Initialize form validator
const addFormValidator = createAddFormValidator(titleInput, titleHint, bodyInput, bodyHint, formMessage, submitButton)

// Helper functions
function clearAndPrepareAddForm() {
  if (!addPostForm) return
  if (typeof HTMLFormElement !== "undefined" && HTMLFormElement.prototype.reset) {
    HTMLFormElement.prototype.reset.call(addPostForm)
  }
  clearValidation(
    [
      { hint: titleHint, input: titleInput },
      { hint: bodyHint, input: bodyInput },
    ],
    formMessage,
  )
  if (submitButton) submitButton.textContent = "Add Post"
  addFormValidator.resetTouched()
  if (submitButton) submitButton.disabled = true
}

function loadEditForm(post) {
  if (!editForm) return
  editTitleInput.value = post.title
  editBodyInput.value = post.body
  clearValidation(
    [
      { hint: editTitleHint, input: editTitleInput },
      { hint: editBodyHint, input: editBodyInput },
    ],
    editFormMessage,
  )
  if (editSubmitButton) editSubmitButton.textContent = "Update Post"
  validateFormGeneric([editTitleInput, editTitleHint, editBodyInput, editBodyHint], editFormMessage, editSubmitButton)
}

function updateAddSubmitState() {
  addFormValidator.validateAddForm()
}

function updateEditSubmitState() {
  validateFormGeneric([editTitleInput, editTitleHint, editBodyInput, editBodyHint], editFormMessage, editSubmitButton)
}

// Menu event listeners
if (navigationManager.menuPosts && navigationManager.menuAddPost) {
  navigationManager.menuPosts.addEventListener("click", () => {
    navigationManager.showPostsList()
    viewManager.refreshView({ resetPage: false })
    window.scrollTo({ top: 0, behavior: "smooth" })
    closeSidebar()
  })

  navigationManager.menuAddPost.addEventListener("click", () => {
    navigationManager.showAddPostForm()
    window.scrollTo({ top: 0, behavior: "smooth" })
    closeSidebar()
  })
}

// Posts table event listeners
const postsBody = document.getElementById("postsBody")
if (postsBody) {
  postsBody.addEventListener("click", (e) => {
    const target = e.target
    if (!(target instanceof HTMLElement)) return

    if (target.classList.contains("delete-button")) {
      const postId = Number.parseInt(target.getAttribute("data-id"), 10)
      const ok = confirm("Are you sure you want to delete this post?")
      if (!ok) return
      deletePost(postId)
      showToast("Post deleted.")
      navigationManager.setMenuActive(true)
      navigationManager.showPostsList()
      viewManager.refreshView()
    }

    if (target.classList.contains("edit-button")) {
      const postId = Number.parseInt(target.getAttribute("data-id"), 10)
      const post = getPost(postId)
      if (!post) return
      navigationManager.showEditPostForm()
      editPostId = post.id
      loadEditForm(post)
      openEditModal()
    }
  })
}

// Add form event listeners
if (addPostForm) {
  titleInput.addEventListener("input", () => {
    addFormValidator.setTouched("title")
    updateAddSubmitState()
  })

  bodyInput.addEventListener("input", () => {
    addFormValidator.setTouched("body")
    updateAddSubmitState()
  })

  addPostForm.addEventListener("submit", (e) => {
    e.preventDefault()
    if (!addFormValidator.validateAddForm({ forceShow: true })) return

    const title = titleInput.value.trim()
    const body = bodyInput.value.trim()

    addPost(title, body)
    showToast("Post added successfully.")

    editPostId = null
    viewManager.currentPage = 1
    navigationManager.setMenuActive(true)
    navigationManager.showPostsList()
    viewManager.refreshView({ resetPage: true })
    clearAndPrepareAddForm()
    window.scrollTo(0, 0)
  })

  if (cancelButton) {
    cancelButton.addEventListener("click", (e) => {
      e.preventDefault()
      editPostId = null
      clearAndPrepareAddForm()
      navigationManager.forceShowPosts()
      titleInput.value = ""
      bodyInput.value = ""
      viewManager.refreshView({ resetPage: false })
      window.scrollTo(0, 0)
    })
  }

  addPostForm.addEventListener("reset", () => {
    clearValidation(
      [
        { hint: titleHint, input: titleInput },
        { hint: bodyHint, input: bodyInput },
      ],
      formMessage,
    )
    if (submitButton) submitButton.textContent = "Add Post"
    addFormValidator.validateAddForm()
  })
}

// Edit form event listeners
if (editForm) {
  editTitleInput.addEventListener("input", updateEditSubmitState)
  editBodyInput.addEventListener("input", updateEditSubmitState)

  editForm.addEventListener("submit", (e) => {
    e.preventDefault()
    if (
      !validateFormGeneric(
        [editTitleInput, editTitleHint, editBodyInput, editBodyHint],
        editFormMessage,
        editSubmitButton,
      )
    )
      return

    const title = editTitleInput.value.trim()
    const body = editBodyInput.value.trim()

    if (editPostId !== null) {
      updatePost(editPostId, title, body)
      showToast("Post updated successfully.")
    }

    editPostId = null
    closeEditModal()
    viewManager.currentPage = 1
    navigationManager.setMenuActive(true)
    navigationManager.showPostsList()
    viewManager.refreshView({ resetPage: true })
    clearAndPrepareAddForm()
    window.scrollTo(0, 0)
  })

  if (editCancelButton) {
    editCancelButton.addEventListener("click", (e) => {
      e.preventDefault()
      editPostId = null
      closeEditModal()
      navigationManager.setMenuActive(true)
      navigationManager.showPostsList()
      viewManager.refreshView({ resetPage: false })
    })
  }

  editForm.addEventListener("reset", () => {
    updateEditSubmitState()
  })
}

// Filter and pagination event listeners
const sortType = document.getElementById("sort-type")
const sortOrder = document.getElementById("sort-order")
const size = document.getElementById("page-size")
const searchInput = document.getElementById("search")
const prevPage = document.getElementById("prev-page")
const nextPage = document.getElementById("next-page")

if (sortType) {
  sortType.addEventListener("change", () => {
    viewManager.refreshView({ resetPage: false })
  })
}

if (sortOrder) {
  sortOrder.addEventListener("change", () => {
    viewManager.refreshView({ resetPage: false })
  })
}

if (size) {
  size.addEventListener("change", () => {
    viewManager.updatePageSize(size.value)
  })
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    viewManager.currentPage = 1
    viewManager.refreshView({ resetPage: true })
  })
}

if (prevPage) {
  prevPage.addEventListener("click", () => {
    viewManager.goToPreviousPage()
  })
}

if (nextPage) {
  nextPage.addEventListener("click", () => {
    viewManager.goToNextPage()
  })
}

// Document-level fallbacks for reliability
document.addEventListener("click", (e) => {
  const el = e.target
  if (!(el instanceof HTMLElement)) return

  if (el.closest && el.closest("#menu-add-post")) {
    e.preventDefault()
    navigationManager.showAddPostForm()
    return
  }

  if (el.id === "cancel") {
    e.preventDefault()
    editPostId = null
    clearAndPrepareAddForm()
    navigationManager.forceShowPosts()
    viewManager.refreshView({ resetPage: false })
    window.scrollTo(0, 0)
  }
})

// Initialize the application
async function initializeApp() {
  try {
    await fetchPosts()
    viewManager.refreshView({ resetPage: true })
  } catch (error) {
    console.error("Failed to initialize app:", error)
  }
}

// Start the application
initializeApp()
