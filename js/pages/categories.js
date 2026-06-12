async function loadCategories() {
  if (hasRole('data_manager')) {
    setTopbarActions(`<button class="btn-primary" onclick="showAddSimple('categories', 'Category', loadCategories)"><i class="ti ti-plus"></i> Add category</button>`)
  }
  const { data } = await db.from('categories').select('*').order('name')
  const rows = data?.map(c => `
    <tr>
      <td>${categoryBadge(c.name)}</td>
      <td>
        <div class="td-actions">
          ${hasRole('data_manager') ? `<button class="icon-btn danger" onclick="deleteSimple('categories', '${c.id}', '${c.name}', loadCategories)" title="Delete"><i class="ti ti-trash"></i></button>` : ''}
        </div>
      </td>
    </tr>
  `).join('') || ''
  setContent(`
    <div class="table-wrap">
      <table>
        <thead><tr><th>Category</th><th></th></tr></thead>
        <tbody>${rows || `<tr><td colspan="2"><div class="empty-state"><i class="ti ti-tag"></i><p>No categories yet</p></div></td></tr>`}</tbody>
      </table>
    </div>
  `)
}
