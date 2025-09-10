// Toast functionality
export function showToast(message) {
  const toastEl = document.getElementById("toast")
  if (!toastEl) return
  toastEl.textContent = message
  toastEl.classList.remove("hide")
  toastEl.classList.add("show")
  setTimeout(() => {
    toastEl.classList.remove("show")
    setTimeout(() => toastEl.classList.add("hide"), 300)
  }, 2000)
}

// Sidebar management
export function initializeSidebar() {
  const sidebarToggle = document.getElementById("sidebar-toggle")
  const container = document.querySelector(".dashboard-container")
  const sidebarEl = document.querySelector(".dashboard-sidebar")
  const sidebarOverlay = document.getElementById("sidebar-overlay")
  const sidebarCloseBtn = document.getElementById("sidebar-close")

  function openSidebar() {
    if (!container) return
    const isDesktop = window.matchMedia("(min-width: 1100px)").matches

    if (isDesktop) {
      // On desktop, remove collapsed class to show sidebar
      container.classList.remove("sidebar-collapsed")
    } else {
      // On mobile, use sidebar-open class
      container.classList.add("sidebar-open")
      document.body.classList.add("no-scroll")
    }

    if (sidebarEl) sidebarEl.setAttribute("aria-hidden", "false")
    if (sidebarOverlay && !isDesktop) sidebarOverlay.setAttribute("aria-hidden", "false")
  }

  function closeSidebar() {
    if (!container) return
    const isDesktop = window.matchMedia("(min-width: 1100px)").matches

    if (isDesktop) {
      // On desktop, add collapsed class to hide sidebar
      container.classList.add("sidebar-collapsed")
    } else {
      // On mobile, remove sidebar-open class
      container.classList.remove("sidebar-open")
      document.body.classList.remove("no-scroll")
    }

    if (sidebarEl) sidebarEl.setAttribute("aria-hidden", "true")
    if (sidebarOverlay) sidebarOverlay.setAttribute("aria-hidden", "true")
  }

  function toggleSidebar() {
    if (!container) return
    const isDesktop = window.matchMedia("(min-width: 1100px)").matches

    if (isDesktop) {
      // On desktop, toggle collapsed class
      if (container.classList.contains("sidebar-collapsed")) {
        openSidebar()
      } else {
        closeSidebar()
      }
    } else {
      // On mobile, toggle sidebar-open class
      if (container.classList.contains("sidebar-open")) {
        closeSidebar()
      } else {
        openSidebar()
      }
    }
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleSidebar)
  }
  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener("click", closeSidebar)
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", (e) => {
      const target = e.target
      if (target instanceof HTMLElement && target.getAttribute("data-close") === "true") {
        closeSidebar()
      }
    })
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSidebar()
  })

  function setInitialSidebarState() {
    const isDesktop = window.matchMedia("(min-width: 1100px)").matches
    if (isDesktop) {
      container.classList.remove("sidebar-collapsed")
      container.classList.remove("sidebar-open")
      // Ensure sidebar is visible
      if (sidebarEl) sidebarEl.setAttribute("aria-hidden", "false")
    } else {
      // On mobile, sidebar should be closed by default
      closeSidebar()
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setInitialSidebarState)
  } else {
    setInitialSidebarState()
  }

  const mqDesktop = window.matchMedia("(min-width: 1100px)")
  function handleViewportChange(e) {
    const isDesktop = e.matches
    if (isDesktop) {
      container.classList.remove("sidebar-open")
      container.classList.remove("sidebar-collapsed")
      document.body.classList.remove("no-scroll")
      if (sidebarOverlay) sidebarOverlay.setAttribute("aria-hidden", "true")
    } else {
      // On mobile, close sidebar when switching from desktop
      container.classList.remove("sidebar-collapsed")
      closeSidebar()
    }
  }

  if (mqDesktop.addEventListener) {
    mqDesktop.addEventListener("change", handleViewportChange)
  } else if (mqDesktop.addListener) {
    mqDesktop.addListener(handleViewportChange)
  }

  return { openSidebar, closeSidebar, toggleSidebar }
}

// Modal management
export function initializeModal() {
  const editModal = document.getElementById("edit-modal")
  const editCloseBtn = document.getElementById("edit-close")
  const modalBackdrop = editModal ? editModal.querySelector(".modal-backdrop") : null

  function openEditModal() {
    if (!editModal) return
    editModal.classList.remove("hide")
    editModal.setAttribute("aria-hidden", "false")
  }

  function closeEditModal() {
    if (!editModal) return
    editModal.classList.add("hide")
    editModal.setAttribute("aria-hidden", "true")
    // Clear edit form fields after closing
    const editForm = document.getElementById("edit-post-form")
    if (editForm) {
      editForm.reset()
    }
  }

  if (editCloseBtn) {
    editCloseBtn.addEventListener("click", () => closeEditModal())
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      const target = e.target
      if (target instanceof HTMLElement && target.getAttribute("data-close") === "true") {
        closeEditModal()
      }
    })
  }
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeEditModal()
  })

  return { openEditModal, closeEditModal }
}
