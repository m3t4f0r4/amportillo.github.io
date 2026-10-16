(() => {
  const form = document.getElementById('loginForm');
  const user = document.getElementById('username');
  const pass = document.getElementById('password');
  const error = document.getElementById('errorMessage');
  const toggle = document.getElementById('togglePassword');
  if (sessionStorage.getItem('portilloAdminAuthenticated') === 'yes') window.location.replace('admin.html');
  toggle.addEventListener('click', () => {
    const show = pass.type === 'password';
    pass.type = show ? 'text' : 'password';
    toggle.textContent = show ? 'Ocultar' : 'Mostrar';
    toggle.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault(); error.textContent = '';
    // Temporary demo credentials only. This is NOT secure authentication.
    if (user.value.trim() === 'admin' && pass.value === 'admin') {
      sessionStorage.setItem('portilloAdminAuthenticated', 'yes');
      window.location.href = 'admin.html';
    } else {
      error.textContent = 'Usuario o contraseña incorrectos. Comprueba las credenciales e inténtalo de nuevo.';
      pass.value = ''; pass.focus();
    }
  });
})();
