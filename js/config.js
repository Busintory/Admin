const SUPABASE_URL = 'https://bljyaadjlbseikmpazol.supabase.co'
const SUPABASE_KEY = 'sb_publishable_cNO4cdKj17u7CvVYoZiLYg_ilFQWcsK'
const { createClient } = supabase
const db = createClient(SUPABASE_URL, SUPABASE_KEY)

let currentStaff = null

const ROLES = { super_admin: 3, data_manager: 2, data_entry: 1 }
