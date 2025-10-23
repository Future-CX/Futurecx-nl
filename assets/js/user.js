const url = window.location.href;
let hash = url.includes('#') ? url.substring(url.indexOf('#') + 1) : '';

// Success hash toggle (no jQuery)
if (hash === 'success') {
  let successEl = document.getElementById('contactsuccess');
  let formEl = document.getElementById('contactform');
  if (successEl) successEl.classList.toggle('d-none');
  if (formEl) formEl.classList.toggle('d-none');
}

// Copyright
(function () {
  try {
    let year = new Date().getFullYear();
    let copyEl = document.getElementById('copyright');
    if (copyEl) {
      copyEl.innerHTML = '© ' + year + ' Future CX by Martijn van Deel';
    }
  } catch (e) {
    // do nothing
    console.error(e);
  }
})();

// Format published dates from their content attribute (ISO) to human text
(function () {
  function updatePublishedDates() {
    let targets = document.querySelectorAll('[itemprop="datePublished"]');
    if (!targets || !targets.length) return;

    let monthsLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    targets.forEach(function (el) {
      let src = el.getAttribute('content') || el.textContent || '';
      let d = new Date(src);
      if (isNaN(d.getTime())) return;
      let dd = d.getDate();
      let mm = monthsLong[d.getMonth()];
      let yyyy = d.getFullYear();
      el.textContent = mm + ' ' + dd + ', ' + yyyy;
      // Preserve existing content attr if provided; otherwise add ISO
      if (!el.getAttribute('content')) {
        try {
          el.setAttribute('content', d.toISOString());
        } catch (e) {
          // do nothing
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updatePublishedDates);
  } else {
    updatePublishedDates();
  }
})();

// Equalize heights of client grid cards (no jQuery)
(function () {
  function equalHeight() {
    let items = document.querySelectorAll('.clients-grid-item article');
    if (!items || !items.length) return;
    // reset heights
    items.forEach(function (el) {
      el.style.height = 'auto';
    });
    // compute max height
    let max = 0;
    items.forEach(function (el) {
      let h = el.offsetHeight;
      if (h > max) max = h;
    });
    // apply max height
    items.forEach(function (el) {
      el.style.height = max + 'px';
    });
  }

  function initEqualHeight() {
    equalHeight();
    // Recalculate on window resize
    window.addEventListener('resize', equalHeight);

    // Recalculate when containers resize (if supported)
    let containers = document.querySelectorAll('.my-shuffle');
    if (typeof ResizeObserver !== 'undefined' && containers.length) {
      let ro = new ResizeObserver(function () {
        equalHeight();
      });
      containers.forEach(function (c) {
        ro.observe(c);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEqualHeight);
  } else {
    initEqualHeight();
  }
})();

// Set social share links (LinkedIn, Twitter/X, Facebook) to current page
(function () {
  function setSocialShareLinks() {
    let url = window.location.href;
    let title = document.title || '';

    // LinkedIn
    let lnBtns = document.querySelectorAll('.btn-linkedin');
    if (lnBtns && lnBtns.length) {
      let lnUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
      lnBtns.forEach(function (btn) {
        btn.setAttribute('href', lnUrl);
        btn.setAttribute('target', '_blank');
        btn.setAttribute('rel', 'noopener noreferrer');
      });
    }

    // Twitter / X
    let twBtns = document.querySelectorAll('.btn-twitter');
    if (twBtns && twBtns.length) {
      let twUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + (title ? '&text=' + encodeURIComponent(title) : '');
      twBtns.forEach(function (btn) {
        btn.setAttribute('href', twUrl);
        btn.setAttribute('target', '_blank');
        btn.setAttribute('rel', 'noopener noreferrer');
      });
    }

    // Facebook
    let fbBtns = document.querySelectorAll('.btn-facebook');
    if (fbBtns && fbBtns.length) {
      let fbUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
      fbBtns.forEach(function (btn) {
        btn.setAttribute('href', fbUrl);
        btn.setAttribute('target', '_blank');
        btn.setAttribute('rel', 'noopener noreferrer');
      });
    }

    // Note: Instagram does not support URL-based web sharing
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setSocialShareLinks);
  } else {
    setSocialShareLinks();
  }
})();

// (Removed) dateModified runtime update — now handled at build time
