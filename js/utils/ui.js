function showToast(msg, type = 'success') {
  const t = document.getElementById('toast')
  t.textContent = msg
  t.className = 'toast show' + (type === 'error' ? ' error' : '')
  setTimeout(() => t.className = 'toast', 3000)
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('open')
  document.getElementById('overlay').classList.add('show')
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open')
  document.getElementById('overlay').classList.remove('show')
}

function closeModal() {
  const m = document.getElementById('modal')
  if (m) m.remove()
}

function showModal(html) {
  closeModal()
  const backdrop = document.createElement('div')
  backdrop.className = 'modal-backdrop'
  backdrop.id = 'modal'
  backdrop.innerHTML = `<div class="modal">${html}</div>`
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal() })
  document.body.appendChild(backdrop)
}
