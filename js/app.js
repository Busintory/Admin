async function init() {
  const { data: { session } } = await db.auth.getSession()
  if (session?.user) {
    await bootApp(session.user)
  }
}

init()
