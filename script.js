// Initialize Supabase - REPLACE WITH YOUR PROJECT URL AND ANON KEY
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// DOM Elements
const authModal = document.getElementById('authModal');
const authTitle = document.getElementById('authTitle');
const authForm = document.getElementById('authForm');
const toggleAuth = document.getElementById('toggleAuth');
const authMessage = document.getElementById('authMessage');
const userProfile = document.getElementById('userProfile');
const userAvatar = document.querySelector('.user-avatar');
const userName = document.querySelector('.user-name');
const logoutBtn = document.getElementById('logoutBtn');
const closeBtn = document.querySelector('.close');

// State
let isSignUpMode = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Check for existing session
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      showUserProfile(session.user);
    } else {
      showAuthModal();
    }
  });

  // Modal close
  closeBtn.addEventListener('click', () => {
    authModal.style.display = 'none';
  });

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === authModal) {
      authModal.style.display = 'none';
    }
  });

  // Toggle between sign in and sign up
  toggleAuth.addEventListener('click', (e) => {
    e.preventDefault();
    isSignUpMode = !isSignUpMode;
    if (isSignUpMode) {
      authTitle.textContent = 'Sign Up';
      authForm.querySelector('button[type="submit"]').textContent = 'Sign Up';
      toggleAuth.textContent = 'Already have an account? Sign In';
    } else {
      authTitle.textContent = 'Sign In';
      authForm.querySelector('button[type="submit"]').textContent = 'Sign In';
      toggleAuth.textContent = "Don't have an account? Sign Up";
    }
    clearMessage();
  });

  // Handle form submission
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      if (isSignUpMode) {
        const { user, error } = await supabase.auth.signUp({
          email,
          password,
          // Optional: send email confirmation
          // options: { emailRedirectTo: `${window.location.origin}/callback.html` }
        });
        if (error) throw error;
        // Note: With email confirmation, user might not be available until they confirm
        showMessage('Check your email to complete registration', 'success');
        // In production, you might want to wait for confirmation or handle differently
      } else {
        const { user, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        showMessage('Signed in successfully!', 'success');
        // Update profile after a short delay to allow auth state to update
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
              showUserProfile(session.user);
              authModal.style.display = 'none';
            }
          });
        }, 1000);
      }
    } catch (error) {
      showMessage(error.message, 'error');
    }
  });

  // Handle logout
  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    hideUserProfile();
    showAuthModal();
  });
});

// Helper functions
function showAuthModal() {
  authModal.style.display = 'block';
  // Reset to sign in mode by default
  if (isSignUpMode) {
    toggleAuth.click(); // Trigger click to switch to sign in
  }
  clearMessage();
  // Clear form
  authForm.reset();
}

function showUserProfile(user) {
  // Update UI
  userName.textContent = user.email.split('@')[0]; // Show first part of email as name
  if (user.avatar_url) {
    userAvatar.src = user.avatar_url;
  } else {
    // Default avatar (you could use Gravatar or a placeholder)
    userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=random`;
  }
  userProfile.style.display = 'flex';
}

function hideUserProfile() {
  userProfile.style.display = 'none';
}

function showMessage(message, type) {
  authMessage.textContent = message;
  authMessage.className = `auth-message ${type}`;
  authMessage.style.display = 'block';
}

function clearMessage() {
  authMessage.style.display = 'none';
  authMessage.textContent = '';
}

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    showUserProfile(session.user);
    authModal.style.display = 'none';
  } else {
    hideUserProfile();
    showAuthModal();
  }
});