async function loadDashboard() {
  const [products, brands, categories, forms] = await Promise.all([
    db.from('products').select('id'),
    db.from('brands').select('id'),
    db.from('categories').select('id'),
    db.from('forms').select('id'),
  ])

  const recent = await db
    .from('products')
    .select('id, name, local_name, categories(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  const rows = recent.data?.map(p => `
    <tr>
      <td><strong>${p.name}</strong></td>
      <td class="td-muted">${p.local_name || '—'}</td>
      <td>${p.categories ? categoryBadge(p.categories.name) : '—'}</td>
    </tr>
  `).join('') || ''

  setContent(`
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total products</div>
        <div class="stat-value">${products.data?.length ?? 0}</div>
        <div class="stat-sub">in catalog</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Brands</div>
        <div class="stat-value">${brands.data?.length ?? 0}</div>
        <div class="stat-sub">registered</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Categories</div>
        <div class="stat-value">${categories.data?.length ?? 0}</div>
        <div class="stat-sub">active</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Forms</div>
        <div class="stat-value">${forms.data?.length ?? 0}</div>
        <div class="stat-sub">variants</div>
      </div>
    </div>
    <div class="section-header">
      <div class="section-title">Recently added products</div>
      <span style="font-size:12px;color:var(--color-primary);cursor:pointer;" onclick="showPage('products')">View all →</span>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Name</th><th>Local name</th><th>Category</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="3"><div class="empty-state"><i class="ti ti-pill"></i><p>No products yet</p></div></td></tr>`}</tbody>
      </table>
    </div>
  `)
}
