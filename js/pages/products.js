async function loadProducts() {
  if (hasRole('data_entry')) {
    setTopbarActions(`<button class="btn-primary" onclick="showAddProduct()"><i class="ti ti-plus"></i> Add product</button>`)
  }

  const { data, error } = await db
    .from('products')
    .select('id, name, local_name, categories(name)')
    .order('name')

  if (error) { setContent(`<div class="empty-state"><p>Error loading products</p></div>`); return }

  const rows = data?.map(p => `
    <tr>
      <td><strong>${p.name}</strong></td>
      <td class="td-muted">${p.local_name || '—'}</td>
      <td>${p.categories ? categoryBadge(p.categories.name) : '—'}</td>
      <td>
        <div class="td-actions">
          ${hasRole('data_entry') ? `<button class="icon-btn" onclick="showAddProduct('${p.id}')" title="Edit"><i class="ti ti-edit"></i></button>` : ''}
          ${hasRole('data_manager') ? `<button class="icon-btn danger" onclick="deleteProduct('${p.id}', '${p.name}')" title="Delete"><i class="ti ti-trash"></i></button>` : ''}
        </div>
      </td>
    </tr>
  `).join('') || ''

  setContent(`
    <div class="table-wrap">
      <div class="table-toolbar">
        <div class="search-box">
          <i class="ti ti-search"></i>
          <input type="text" placeholder="Search products…" oninput="filterTable(this.value, 'products-table')"/>
        </div>
      </div>
      <table id="products-table">
        <thead><tr><th>Name</th><th>Local name</th><th>Category</th><th></th></tr></thead>
        <tbody>${rows || `<tr><td colspan="4"><div class="empty-state"><i class="ti ti-pill"></i><p>No products yet</p></div></td></tr>`}</tbody>
      </table>
    </div>
  `)
}

async function showAddProduct(productId = null) {
  const isEdit = !!productId
  document.getElementById('page-title').textContent = isEdit ? 'Edit product' : 'Add product'
  setTopbarActions(`<button class="btn-ghost" onclick="showPage('products')">← Back</button>`)

  const [cats, brands, forms] = await Promise.all([
    db.from('categories').select('*').order('name'),
    db.from('brands').select('*').order('name'),
    db.from('forms').select('*').order('name'),
  ])

  let product = null
  let selectedBrands = []
  window._selectedForms = new Set()
  window._variants = []

  if (isEdit) {
    const { data } = await db.from('products').select('*').eq('id', productId).single()
    product = data
    const [pb, pf] = await Promise.all([
      db.from('product_brands').select('brand_id').eq('product_id', productId),
      db.from('product_forms').select('form_id, size_label, forms(name)').eq('product_id', productId),
    ])
    selectedBrands = pb.data?.map(r => r.brand_id) || []
    window._variants = pf.data?.map(r => ({
      form_id: r.form_id,
      form_name: r.forms.name,
      size_label: r.size_label || ''
    })) || []
  }

  const catOptions = cats.data?.map(c =>
    `<option value="${c.id}" ${product?.category_id === c.id ? 'selected' : ''}>${c.name}</option>`
  ).join('') || ''

  const brandChips = brands.data?.map(b =>
    `<div class="chip ${selectedBrands.includes(b.id) ? 'selected' : ''}"
      onclick="toggleChip(this, '${b.id}', 'brand')">${b.name}</div>`
  ).join('') || ''

  const formOptions = forms.data?.map(f =>
    `<option value="${f.id}">${f.name}</option>`
  ).join('') || ''

  window._selectedBrands = new Set(selectedBrands)

  setContent(`
    <div class="form-card">
      <div class="form-card-title">Basic info</div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Name <span class="optional">required</span></label>
          <input class="form-input" id="f-name" placeholder="e.g. Paracetamol" value="${product?.name || ''}"/>
        </div>
        <div class="form-group">
          <label class="form-label">Local name <span class="optional">optional</span></label>
          <input class="form-input" id="f-local" placeholder="e.g. Flagyl, Panadol" value="${product?.local_name || ''}"/>
        </div>
        <div class="form-group">
          <label class="form-label">Category <span class="optional">required</span></label>
          <select class="form-select" id="f-category">
            <option value="">Select category…</option>
            ${catOptions}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Description <span class="optional">optional</span></label>
          <input class="form-input" id="f-desc" placeholder="Short note…" value="${product?.description || ''}"/>
        </div>
      </div>
    </div>

    <div class="form-card">
      <div class="form-card-title">Brands</div>
      <div class="chip-group" id="brand-chips">${brandChips}</div>
    </div>

    <div class="form-card">
      <div class="form-card-title">Forms / Variants</div>

      <div id="variant-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
      </div>

      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <select class="form-select" id="new-form-select" style="width:180px;">
          ${formOptions}
        </select>
        <input class="form-input" id="new-size-input"
          placeholder="Size e.g. 500mg, large (optional)"
          style="flex:1;min-width:160px;"/>
        <button class="btn-ghost" onclick="addVariantRow()">
          <i class="ti ti-plus"></i> Add variant
        </button>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn-ghost" onclick="showPage('products')">Cancel</button>
      <button class="btn-primary" onclick="saveProduct(${isEdit ? `'${productId}'` : null})">
        <i class="ti ti-check"></i> ${isEdit ? 'Save changes' : 'Save product'}
      </button>
    </div>
  `)

  window._variants.forEach((v, i) => renderVariantRow(v, i))
}

function toggleChip(el, id, type) {
  el.classList.toggle('selected')
  const set = type === 'brand' ? window._selectedBrands : window._selectedForms
  el.classList.contains('selected') ? set.add(id) : set.delete(id)
}

function renderVariantRow(variant, index) {
  const list = document.getElementById('variant-list')
  const row = document.createElement('div')
  row.id = `variant-row-${index}`
  row.style.cssText = 'display:flex;align-items:center;gap:8px;background:var(--color-bg);padding:8px 12px;border-radius:8px;border:1px solid var(--color-border);'
  row.innerHTML = `
    <span style="font-size:13px;font-weight:500;color:var(--color-text);flex:0 0 auto;">${variant.form_name}</span>
    ${variant.size_label
      ? `<span style="font-size:12px;color:var(--color-text-secondary);">· ${variant.size_label}</span>`
      : `<span style="font-size:12px;color:var(--color-text-tertiary);">· no size</span>`
    }
    <button class="icon-btn danger" onclick="removeVariantRow(${index})"
      style="margin-left:auto;" title="Remove">
      <i class="ti ti-x"></i>
    </button>
  `
  list.appendChild(row)
}

function addVariantRow() {
  const formSelect = document.getElementById('new-form-select')
  const sizeInput = document.getElementById('new-size-input')

  const form_id = formSelect.value
  const form_name = formSelect.options[formSelect.selectedIndex].text
  const size_label = sizeInput.value.trim()

  if (!form_id) { showToast('Please select a form', 'error'); return }

  const index = window._variants.length
  window._variants.push({ form_id, form_name, size_label })
  renderVariantRow({ form_id, form_name, size_label }, index)

  sizeInput.value = ''
}

function removeVariantRow(index) {
  window._variants.splice(index, 1)
  const list = document.getElementById('variant-list')
  list.innerHTML = ''
  window._variants.forEach((v, i) => renderVariantRow(v, i))
}

async function saveProduct(productId = null) {
  const name = document.getElementById('f-name').value.trim()
  const local_name = document.getElementById('f-local').value.trim()
  const category_id = document.getElementById('f-category').value
  const description = document.getElementById('f-desc').value.trim()

  if (!name) { showToast('Product name is required', 'error'); return }
  if (!category_id) { showToast('Please select a category', 'error'); return }

  const payload = { name, local_name: local_name || null, category_id, description: description || null }

  let id = productId
  if (productId) {
    const { error } = await db.from('products').update(payload).eq('id', productId)
    if (error) { showToast('Error saving product', 'error'); return }
  } else {
    const { data, error } = await db.from('products').insert(payload).select().single()
    if (error) { showToast('Error saving product', 'error'); return }
    id = data.id
  }

  await db.from('product_brands').delete().eq('product_id', id)
  if (window._selectedBrands.size > 0) {
    await db.from('product_brands').insert([...window._selectedBrands].map(brand_id => ({ product_id: id, brand_id })))
  }

  await db.from('product_forms').delete().eq('product_id', id)
  if (window._variants.length > 0) {
    await db.from('product_forms').insert(
      window._variants.map(v => ({
        product_id: id,
        form_id: v.form_id,
        size_label: v.size_label || null
      }))
    )
  }

  showToast(productId ? 'Product updated!' : 'Product added!')
  showPage('products')
}

async function deleteProduct(id, name) {
  if (!hasRole('data_manager')) { showToast('Permission denied', 'error'); return }
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
  const { error } = await db.from('products').delete().eq('id', id)
  if (error) { showToast('Error deleting product', 'error'); return }
  showToast('Product deleted')
  loadProducts()
}
