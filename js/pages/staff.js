async function loadStaff() {
  if (!hasRole('super_admin')) { showToast('Permission denied', 'error'); return }
  setTopbarActions(`<button class="btn-primary" onclick="showAddStaff()"><i class="ti ti-plus"></i> Add staff</button>`)

  const { data } = await db.from('staff').select('*').order('full_name')
  const rows = data?.map(s => `
    <tr>
      <td><strong>${s.full_name}</strong></td>
      <td>${roleBadge(s.role)}</td>
      <td>
        <div class="td-actions">
          ${s.id !== currentStaff.id ? `
            <button class="icon-btn" onclick="showEditStaffRole('${s.id}', '${s.full_name}', '${s.role}')" title="Change role"><i class="ti ti-edit"></i></button>
            <button class="icon-btn danger" onclick="deleteStaff('${s.id}', '${s.full_name}')" title="Remove"><i class="ti ti-trash"></i></button>
          ` : '<span style="font-size:11px;color:var(--color-text-tertiary);">you</span>'}
        </div>
      </td>
    </tr>
  `).join('') || ''

  setContent(`
    <div class="table-wrap">
      <table>
        <thead><tr><th>Name</th><th>Role</th><th></th></tr></thead>
        <tbody>${rows || `<tr><td colspan="3"><div class="empty-state"><i class="ti ti-users"></i><p>No staff yet</p></div></td></tr>`}</tbody>
      </table>
    </div>
  `)
}

function showAddStaff() {
  showModal(`
    <div class="modal-title">Add staff member</div>
    <div class="form-group" style="margin-bottom:12px;">
      <label class="form-label">Full name</label>
      <input class="form-input" id="s-name" type="text" placeholder="e.g. Amaka Obi"/>
    </div>
    <div class="form-group" style="margin-bottom:12px;">
      <label class="form-label">Email</label>
      <input class="form-input" id="s-email" type="email" placeholder="staff@email.com"/>
    </div>
    <div class="form-group" style="margin-bottom:12px;">
      <label class="form-label">Password</label>
      <input class="form-input" id="s-password" type="password" placeholder="Min 6 characters"/>
    </div>
    <div class="form-group" style="margin-bottom:20px;">
      <label class="form-label">Role</label>
      <select class="form-select" id="s-role">
        <option value="data_entry">Data Entry</option>
        <option value="data_manager">Data Manager</option>
        <option value="super_admin">Super Admin</option>
      </select>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;">
      <button class="btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="saveStaff()">Add staff</button>
    </div>
  `)
}

async function saveStaff() {
  const full_name = document.getElementById('s-name').value.trim()
  const email = document.getElementById('s-email').value.trim()
  const password = document.getElementById('s-password').value
  const role = document.getElementById('s-role').value

  if (!full_name || !email || !password) { showToast('All fields are required', 'error'); return }
  if (password.length < 6) { showToast('Password must be at least 6 characters', 'error'); return }

  const { data, error } = await db.auth.admin.createUser({ email, password, email_confirm: true })
  if (error) { showToast(error.message, 'error'); return }

  const { error: staffError } = await db.from('staff').insert({ id: data.user.id, full_name, role })
  if (staffError) { showToast('Error creating staff record', 'error'); return }

  closeModal()
  showToast('Staff member added!')
  loadStaff()
}

function showEditStaffRole(id, name, currentRole) {
  showModal(`
    <div class="modal-title">Change role — ${name}</div>
    <div class="form-group" style="margin-bottom:20px;">
      <label class="form-label">Role</label>
      <select class="form-select" id="edit-role">
        <option value="data_entry" ${currentRole === 'data_entry' ? 'selected' : ''}>Data Entry</option>
        <option value="data_manager" ${currentRole === 'data_manager' ? 'selected' : ''}>Data Manager</option>
        <option value="super_admin" ${currentRole === 'super_admin' ? 'selected' : ''}>Super Admin</option>
      </select>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;">
      <button class="btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="updateStaffRole('${id}')">Save</button>
    </div>
  `)
}

async function updateStaffRole(id) {
  const role = document.getElementById('edit-role').value
  const { error } = await db.from('staff').update({ role }).eq('id', id)
  if (error) { showToast('Error updating role', 'error'); return }
  closeModal()
  showToast('Role updated!')
  loadStaff()
}

async function deleteStaff(id, name) {
  if (!confirm(`Remove "${name}" from staff? They will no longer be able to log in.`)) return
  const { error } = await db.from('staff').delete().eq('id', id)
  if (error) { showToast('Error removing staff', 'error'); return }
  showToast('Staff member removed')
  loadStaff()
}
