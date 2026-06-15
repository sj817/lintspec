export function mount(id) {
  const element = document.querySelector(`#${id}`)

  if (element) {
    element.textContent = 'ready'
  }

  return element
}
