(function () {
  var section = document.querySelector("[data-social-embeds]");
  if (!section) return;

  var loaded = false;

  function loadScript(src) {
    var s = document.createElement("script");
    s.src = src;
    s.async = true;
    document.body.appendChild(s);
  }

  function loadEmbeds() {
    if (loaded) return;
    loaded = true;

    if (section.querySelector(".fb-page")) {
      var fbRoot = document.createElement("div");
      fbRoot.id = "fb-root";
      document.body.insertBefore(fbRoot, document.body.firstChild);
      loadScript("https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v19.0");
    }
    if (section.querySelector(".instagram-media")) {
      loadScript("https://www.instagram.com/embed.js");
    }
    if (section.querySelector(".tiktok-embed")) {
      loadScript("https://www.tiktok.com/embed.js");
    }
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          loadEmbeds();
          observer.disconnect();
        }
      });
    }, { rootMargin: "200px" });
    observer.observe(section);
  } else {
    loadEmbeds();
  }
})();
