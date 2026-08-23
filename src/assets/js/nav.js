(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".primary-nav");

  if (!toggle || !nav) return;

  function closeSubmenus() {
    nav.querySelectorAll('[aria-expanded="true"].primary-nav__toggle').forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
      var submenu = document.getElementById(btn.getAttribute("aria-controls"));
      if (submenu) submenu.classList.remove("is-open");
    });
  }

  toggle.addEventListener("click", function () {
    var isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
    if (isOpen) closeSubmenus();
  });

  nav.querySelectorAll(".primary-nav__toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var submenu = document.getElementById(btn.getAttribute("aria-controls"));
      var isOpen = btn.getAttribute("aria-expanded") === "true";

      nav.querySelectorAll(".primary-nav__toggle").forEach(function (other) {
        if (other !== btn) {
          other.setAttribute("aria-expanded", "false");
          var otherSubmenu = document.getElementById(other.getAttribute("aria-controls"));
          if (otherSubmenu) otherSubmenu.classList.remove("is-open");
        }
      });

      btn.setAttribute("aria-expanded", String(!isOpen));
      if (submenu) submenu.classList.toggle("is-open", !isOpen);
    });
  });

  document.addEventListener("click", function (event) {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      closeSubmenus();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      closeSubmenus();
    }
  });

  window.matchMedia("(min-width: 768px)").addEventListener("change", function (event) {
    if (event.matches) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();
