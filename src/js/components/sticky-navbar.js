/**
 * Sticky Navbar
 * Enable sticky behavior of navigation bar on page scroll
 */

export default (() => {
  let navbar = document.querySelector('.navbar-sticky');

  if (navbar == null) return;

  let navbarClass = navbar.classList,
    navbarH = navbar.offsetHeight,
    scrollOffset = 500;

  // Allow per-page override via data attribute
  const attr = navbar.getAttribute('data-sticky-offset');
  if (attr && !isNaN(parseInt(attr, 10))) {
    scrollOffset = parseInt(attr, 10);
  }

  if (navbarClass.contains('position-absolute')) {
    window.addEventListener('scroll', (e) => {
      if (e.currentTarget.pageYOffset > scrollOffset) {
        navbar.classList.add('navbar-stuck');
      } else {
        navbar.classList.remove('navbar-stuck');
      }
    });
  } else {
    window.addEventListener('scroll', (e) => {
      if (e.currentTarget.pageYOffset > scrollOffset) {
        document.body.style.paddingTop = navbarH + 'px';
        navbar.classList.add('navbar-stuck');
      } else {
        document.body.style.paddingTop = '';
        navbar.classList.remove('navbar-stuck');
      }
    });
  }
})();
