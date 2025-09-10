export function clearValidation(hintsAndInputs, msgEl) {
  if (msgEl) {
    msgEl.textContent = ""
    msgEl.className = "form-message"
  }
  hintsAndInputs.forEach((item) => {
    if (item.hint) {
      item.hint.textContent = ""
      item.hint.classList.remove("error")
    }
    if (item.input) item.input.classList.remove("invalid")
  })
}

export function validateRequiredMin(input, hint, requiredMsg, minMsg, minLen) {
  const value = input.value.trim()
  if (!value) {
    hint.textContent = requiredMsg
    hint.classList.add("error")
    input.classList.add("invalid")
    return false
  }
  if (value.length < minLen) {
    hint.textContent = minMsg
    hint.classList.add("error")
    input.classList.add("invalid")
    return false
  }
  hint.textContent = ""
  hint.classList.remove("error")
  input.classList.remove("invalid")
  return true
}

export function validateFormGeneric(inputs, msgEl, submitBtn) {
  const [tInput, tHint, bInput, bHint] = inputs
  let ok = true
  ok = validateRequiredMin(tInput, tHint, "Title is required.", "Title must be at least 3 characters.", 3) && ok
  ok = validateRequiredMin(bInput, bHint, "Body is required.", "Body must be at least 10 characters.", 10) && ok
  if (msgEl) {
    msgEl.textContent = ok ? "" : msgEl.textContent
    msgEl.className = ok ? "form-message" : "form-message error"
  }
  if (submitBtn) submitBtn.disabled = !ok
  return ok
}

export function createAddFormValidator(titleInput, titleHint, bodyInput, bodyHint, formMessage, submitButton) {
  let addTouched = { title: false, body: false }

  function validateAddForm(options = {}) {
    const { forceShow = false } = options
    if (!titleInput || !bodyInput) return false

    const titleValue = titleInput.value.trim()
    const bodyValue = bodyInput.value.trim()

    const isTitleValid = titleValue.length >= 3
    const isBodyValid = bodyValue.length >= 10

    // title
    if (forceShow || addTouched.title) {
      if (!titleValue) {
        titleHint.textContent = "Title is required."
        titleHint.classList.add("error")
        titleInput.classList.add("invalid")
      } else if (!isTitleValid) {
        titleHint.textContent = "Title must be at least 3 characters."
        titleHint.classList.add("error")
        titleInput.classList.add("invalid")
      } else {
        titleHint.textContent = ""
        titleHint.classList.remove("error")
        titleInput.classList.remove("invalid")
      }
    } else {
      titleHint.textContent = ""
      titleHint.classList.remove("error")
      titleInput.classList.remove("invalid")
    }

    // body
    if (forceShow || addTouched.body) {
      if (!bodyValue) {
        bodyHint.textContent = "Body is required."
        bodyHint.classList.add("error")
        bodyInput.classList.add("invalid")
      } else if (!isBodyValid) {
        bodyHint.textContent = "Body must be at least 10 characters."
        bodyHint.classList.add("error")
        bodyInput.classList.add("invalid")
      } else {
        bodyHint.textContent = ""
        bodyHint.classList.remove("error")
        bodyInput.classList.remove("invalid")
      }
    } else {
      bodyHint.textContent = ""
      bodyHint.classList.remove("error")
      bodyInput.classList.remove("invalid")
    }

    if (formMessage) {
      formMessage.textContent = ""
      formMessage.className = "form-message"
    }

    const ok = isTitleValid && isBodyValid
    if (submitButton) submitButton.disabled = !ok
    return ok
  }

  function setTouched(field) {
    addTouched[field] = true
  }

  function resetTouched() {
    addTouched = { title: false, body: false }
  }

  return { validateAddForm, setTouched, resetTouched }
}
