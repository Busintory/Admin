function categoryBadge(name) {
  const map = {
    'Medicine': 'badge-medicine', 'Cream': 'badge-cream',
    'Drinks': 'badge-drinks', 'Perfume': 'badge-perfume',
    'Food': 'badge-food', 'Recharge card': 'badge-recharge',
  }
  return `<span class="badge ${map[name] || 'badge-other'}">${name}</span>`
}
