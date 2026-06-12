function showAddSimple(table, label, reloader) {
  showModal(`
    <div class="modal-title">Add ${label}</div>
    <div class="form-group" style="margin-bottom:20px;">
      <label class="form-label">${label} name</label>
      <input class="form-input" id="simple-input" placeholder="Enter name…"
        onkeydown="if(event.key==='Enter') saveSimple('${table}', '${label}', ${reloader.name})"/>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;">
      <button class="btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="saveSimple('${table}', '${label}', ${reloader.name})">Save</button>
    </div>
  `)
  setTimeout(() => document.getElementById('simple-input')?.focus(), 50)
}

async function saveSimple(table, label, reloader) {
  const name = document.getElementById('simple-input').value.trim()
  if (!name) { showToast(`${label} name is required`, 'error'); return }
  const { error } = await db.from(table).insert({ name })
  if (error) {
    showToast(error.message.includes('unique') ? `${label} already exists` : 'Error saving', 'error')
    return
  }
  closeModal()
  showToast(`${label} added!`)
  const reloaders = { loadBrands, loadCategories, loadForms }
  if (reloaders[reloader]) reloaders[reloader]()
}

async function deleteSimple(table, id, name, reloader) {
  if (!confirm(`Delete "${name}"?`)) return
  const { error } = await db.from(table).delete().eq('id', id)
  if (error) { showToast('Error deleting', 'error'); return }
  showToast('Deleted')
  reloader()
}
