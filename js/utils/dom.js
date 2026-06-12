function setContent(html) {
  document.getElementById('content').innerHTML = html
}

function setTopbarActions(html) {
  document.getElementById('topbar-actions').innerHTML = html
}

function filterTable(query, tableId) {
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(query.toLowerCase()) ? '' : 'none'
  })
}
