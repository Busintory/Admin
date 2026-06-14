// js/app.js

async function init() {
  const splash = document.getElementById('splash-screen');
  
  try {
    // 1. Check Supabase for an active session
    const { data: { session } } = await db.auth.getSession();
    
    if (session?.user) {
      // 2. Session exists! Boot the app and fetch staff profiles under the cover of the splash screen
      await bootApp(session.user);
    } else {
      // 3. No active session, drop the hidden class from the login screen
      document.getElementById('login-screen').classList.remove('hidden');
    }
  } catch (err) {
    console.error("App initialization failed:", err);
    // Fallback behavior if everything breaks down
    document.getElementById('login-screen').classList.remove('hidden');
  } finally {
    // 4. Everything is resolved and configured. Remove the splash screen layout safely!
    if (splash) {
      // Add a fade transition if you want it smooth
      splash.style.transition = 'opacity 0.4s ease';
      splash.style.opacity = '0';
      
      // Completely drop it from the DOM after it fades out
      setTimeout(() => splash.remove(), 400);
    }
  }
}

init();