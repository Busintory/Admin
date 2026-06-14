async function loadBrands() {
  if (hasRole('data_entry')) {
    setTopbarActions(`<button class="btn-primary" onclick="showAddSimple('brands', 'Brand', loadBrands)"><i class="ti ti-plus"></i> Add brand</button>`)
  }
  const { data } = await db.from('brands').select('*').order('name')
  const rows = data?.map(b => `
    <tr>
      <td><strong>${escapeHtml(b.name)}</strong></td>
      <td>
        <div class="td-actions">
          ${hasRole('data_manager') ? `<button class="icon-btn danger" onclick="deleteSimple('brands', '${escapeJsString(b.id)}', '${escapeJsString(b.name)}', loadBrands)" title="Delete"><i class="ti ti-trash"></i></button>` : ''}
        </div>
      </td>
    </tr>
  `).join('') || ''
  setContent(`
    <div class="table-wrap">
      <table>
        <thead><tr><th>Brand name</th><th></th></tr></thead>
        <tbody>${rows || `<tr><td colspan="2"><div class="empty-state"><i class="ti ti-building"></i><p>No brands yet</p></div></td></tr>`}</tbody>
      </table>
    </div>
  `)
}
