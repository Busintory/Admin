function showPage(page) {
  if (page === 'categories' && !hasRole('data_manager')) {
    showToast('You do not have permission to manage categories', 'error'); return
  }
  if (page === 'staff' && !hasRole('super_admin')) {
    showToast('You do not have permission to manage staff', 'error'); return
  }

  document.querySelectorAll('.nav-item').forEach(i => {
    i.classList.toggle('active', i.getAttribute('onclick') === `showPage('${page}')`)
  })

  document.querySelectorAll('.bottom-nav-item').forEach(i => {
    i.classList.toggle('active', i.getAttribute('onclick') === `showPage('${page}')`)
  })

  closeSidebar()

  const titles = {
    dashboard: 'Dashboard', products: 'Products', brands: 'Brands',
    categories: 'Categories', forms: 'Forms / Variants', staff: 'Staff'
  }

  document.getElementById('page-title').textContent = titles[page] || page
  setTopbarActions('')
  setContent('<div class="loading">Loading...</div>')

  const pages = {
    dashboard: loadDashboard,
    products: loadProducts,
    brands: loadBrands,
    categories: loadCategories,
    forms: loadForms,
    staff: loadStaff
  }
  if (pages[page]) pages[page]()
}
