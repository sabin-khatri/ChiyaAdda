document.addEventListener('DOMContentLoaded', () => {
  const authOverlay = document.getElementById('auth-overlay');
  const loginContainer = document.getElementById('login-container');
  const signupContainer = document.getElementById('signup-container');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const showSignupBtn = document.getElementById('show-signup-btn');
  const showLoginBtn = document.getElementById('show-login-btn');
  const loginError = document.getElementById('login-error');
  const signupError = document.getElementById('signup-error');
  const loginSuccess = document.getElementById('login-success');
  const signupSuccess = document.getElementById('signup-success');
  const mainHeader = document.getElementById('main-header');
  const mainContent = document.getElementById('main-content');
  const mainFooter = document.getElementById('main-footer');
  const logoutButton = document.getElementById('logout-button');
  const logoutButtonMobile = document.getElementById('logout-button-mobile');

  // Simple "hashing" function for demonstration (server-side bcrypt recommended)
  const pseudoHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return 'h' + hash;
  };

  // Check authentication status
  const checkAuth = () => {
    if (sessionStorage.getItem('chiyaGharUser')) {
      authOverlay.classList.add('opacity-0', 'pointer-events-none');
      mainHeader.classList.remove('invisible');
      mainContent.classList.remove('invisible');
      mainFooter.classList.remove('invisible');
      if (logoutButton) logoutButton.classList.remove('hidden');
      if (logoutButtonMobile) logoutButtonMobile.classList.remove('hidden');
    } else {
      authOverlay.classList.remove('opacity-0', 'pointer-events-none');
      if (logoutButton) logoutButton.classList.add('hidden');
      if (logoutButtonMobile) logoutButtonMobile.classList.add('hidden');
    }
  };

  // Form switching
  if (showSignupBtn) {
    showSignupBtn.addEventListener('click', () => {
      loginContainer.classList.add('hidden');
      signupContainer.classList.remove('hidden');
      loginError.textContent = '';
      signupError.textContent = '';
      loginSuccess.classList.add('hidden');
      signupSuccess.classList.add('hidden');
    });
  }

  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', () => {
      signupContainer.classList.add('hidden');
      loginContainer.classList.remove('hidden');
      loginError.textContent = '';
      signupError.textContent = '';
      loginSuccess.classList.add('hidden');
      signupSuccess.classList.add('hidden');
    });
  }

  // Handle Sign Up
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitButton = signupForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="loading-spinner"></span>';
      signupError.textContent = '';
      signupSuccess.classList.add('hidden');

      const username = document.getElementById('signup-username').value.trim();
      const password = document.getElementById('signup-password').value;
      const users = JSON.parse(localStorage.getItem('chiyaGharUsers')) || {};

      if (!username || username.length < 3) {
        signupError.textContent = 'Username must be at least 3 characters.';
        submitButton.disabled = false;
        submitButton.innerHTML = 'Sign Up';
        return;
      }

      if (!password || password.length < 6) {
        signupError.textContent = 'Password must be at least 6 characters.';
        submitButton.disabled = false;
        submitButton.innerHTML = 'Sign Up';
        return;
      }

      if (users[username]) {
        signupError.textContent = 'Username already exists.';
        submitButton.disabled = false;
        submitButton.innerHTML = 'Sign Up';
        return;
      }

      // Simulate async operation (e.g., server call)
      await new Promise(resolve => setTimeout(resolve, 1000));

      users[username] = pseudoHash(password);
      localStorage.setItem('chiyaGharUsers', JSON.stringify(users));
      sessionStorage.setItem('chiyaGharUser', username);
      signupSuccess.textContent = 'Account created! Logging in...';
      signupSuccess.classList.remove('hidden');

      setTimeout(() => {
        checkAuth();
        submitButton.disabled = false;
        submitButton.innerHTML = 'Sign Up';
      }, 1000);
    });
  }

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitButton = loginForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="loading-spinner"></span>';
      loginError.textContent = '';
      loginSuccess.classList.add('hidden');

      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;
      const users = JSON.parse(localStorage.getItem('chiyaGharUsers')) || {};

      if (!username || !password) {
        loginError.textContent = 'Please enter both username and password.';
        submitButton.disabled = false;
        submitButton.innerHTML = 'Login';
        return;
      }

      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (users[username] && users[username] === pseudoHash(password)) {
        sessionStorage.setItem('chiyaGharUser', username);
        loginSuccess.textContent = 'Login successful!';
        loginSuccess.classList.remove('hidden');
        setTimeout(() => {
          checkAuth();
          submitButton.disabled = false;
          submitButton.innerHTML = 'Login';
        }, 1000);
      } else {
        loginError.textContent = 'Invalid username or password.';
        submitButton.disabled = false;
        submitButton.innerHTML = 'Login';
      }
    });
  }

  // Handle Logout
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      sessionStorage.removeItem('chiyaGharUser');
      checkAuth();
    });
  }
  if (logoutButtonMobile) {
    logoutButtonMobile.addEventListener('click', () => {
      sessionStorage.removeItem('chiyaGharUser');
      mobileMenu.classList.add('translate-x-full');
      menuIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
      checkAuth();
    });
  }

  // Initial auth check
  checkAuth();
});