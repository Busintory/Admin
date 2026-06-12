async function loadForms() {
  if (hasRole('data_entry')) {
    setTopbarActions(`<button class="btn-primary" onclick="showAddSimple('forms', 'Form', loadForms)"><i class="ti ti-plus"></i> Add form</button>`)
  }
  const { data } = await db.from('forms').select('*').order('name')
  const rows = data?.map(f => `
    <tr>
      <td><strong>${f.name}</strong></td>
      <td>
        <div class="td-actions">
          ${hasRole('data_manager') ? `<button class="icon-btn danger" onclick="deleteSimple('forms', '${f.id}', '${f.name}', loadForms)" title="Delete"><i class="ti ti-trash"></i></button>` : ''}
        </div>
      </td>
    </tr>
  `).join('') || ''
  setContent(`
    <div class="table-wrap">
      <table>
        <thead><tr><th>Form name</th><th></th></tr></thead>
        <tbody>${rows || `<tr><td colspan="2"><div class="empty-state"><i class="ti ti-layout-list"></i><p>No forms yet</p></div></td></tr>`}</tbody>
      </table>
    </div>
  `)
}
