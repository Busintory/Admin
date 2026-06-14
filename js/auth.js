function hasRole(minRole) {
  if (!currentStaff) return false
  return ROLES[currentStaff.role] >= ROLES[minRole]
}

function roleLabel(role) {
  return { super_admin: 'Super Admin', data_manager: 'Data Manager', data_entry: 'Data Entry' }[role] || role
}

function roleBadge(role) {
  const map = {
    super_admin:  ['badge-super-admin',  'Super Admin'],
    data_manager: ['badge-data-manager', 'Data Manager'],
    data_entry:   ['badge-data-entry',   'Data Entry'],
  }
  const [cls, label] = map[role] || ['badge-other', role]
  return `<span class="badge ${cls}">${escapeHtml(label)}</span>`
}

async function handleLogin() {
  const email = document.getElementById('login-email').value.trim()
  const password = document.getElementById('login-password').value
  const errEl = document.getElementById('login-error')
  errEl.textContent = ''

  if (!email || !password) { errEl.textContent = 'Please enter your email and password.'; return }

  const { data, error } = await db.auth.signInWithPassword({ email, password })
  if (error) { errEl.textContent = error.message; return }

  await bootApp(data.user)
}

async function handleLogout() {
  await db.auth.signOut()
  currentStaff = null
  document.getElementById('app-screen').classList.add('hidden')
  document.getElementById('login-screen').classList.remove('hidden')
  document.getElementById('login-email').value = ''
  document.getElementById('login-password').value = ''
}

// Inside js/auth.js

async function bootApp(user) {
  // Pull profile information down while splash screen is hiding the main layout
  const { data: staff, error } = await db.from('staff').select('*').eq('id', user.id).single();
  
  if (error || !staff) {
    await db.auth.signOut();
    document.getElementById('app-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('login-error').textContent = 'Your account is not registered as staff. Contact the admin.';
    return;
  }

  currentStaff = staff;

  document.getElementById('staff-name').textContent = staff.full_name;
  document.getElementById('staff-role').textContent = roleLabel(staff.role);
  document.getElementById('nav-staff').style.display = hasRole('super_admin') ? '' : 'none';

  // Revel the dashboard framework shell
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');

  // Trigger content population routines
  loadDashboard();
}
