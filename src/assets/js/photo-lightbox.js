(function () {
  var figures = document.querySelectorAll(".photo-grid figure");
  if (!figures.length) return;

  function largestSrc(img) {
    var srcset = img.getAttribute("srcset");
    if (!srcset) return img.currentSrc || img.src;
    var best = null;
    srcset.split(",").forEach(function (entry) {
      var parts = entry.trim().split(/\s+/);
      var width = parseInt(parts[1], 10) || 0;
      if (!best || width > best.width) best = { url: parts[0], width: width };
    });
    return best ? best.url : img.src;
  }

  var items = Array.prototype.map.call(figures, function (fig) {
    var img = fig.querySelector("img");
    var caption = fig.querySelector("figcaption");
    return {
      full: img ? largestSrc(img) : null,
      alt: img ? img.alt : "",
      caption: caption ? caption.textContent : "",
    };
  });

  var overlay, overlayImg, overlayCaption, currentIndex = 0;

  function build() {
    overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Photo viewer");
    overlay.hidden = true;
    overlay.innerHTML =
      '<button type="button" class="lightbox__close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox__prev" aria-label="Previous photo">&#8249;</button>' +
      '<button type="button" class="lightbox__next" aria-label="Next photo">&#8250;</button>' +
      '<figure class="lightbox__figure">' +
      '<img class="lightbox__img" alt="">' +
      '<figcaption class="lightbox__caption"></figcaption>' +
      "</figure>";
    document.body.appendChild(overlay);
    overlayImg = overlay.querySelector(".lightbox__img");
    overlayCaption = overlay.querySelector(".lightbox__caption");

    overlay.querySelector(".lightbox__close").addEventListener("click", close);
    overlay.querySelector(".lightbox__prev").addEventListener("click", function () {
      show(currentIndex - 1);
    });
    overlay.querySelector(".lightbox__next").addEventListener("click", function () {
      show(currentIndex + 1);
    });
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) close();
    });
    document.addEventListener("keydown", function (event) {
      if (overlay.hidden) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") show(currentIndex - 1);
      if (event.key === "ArrowRight") show(currentIndex + 1);
    });
  }

  function show(index) {
    if (!overlay) build();
    currentIndex = (index + items.length) % items.length;
    var item = items[currentIndex];
    if (!item.full) return;
    overlayImg.src = item.full;
    overlayImg.alt = item.alt;
    overlayCaption.textContent = item.caption;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    overlay.querySelector(".lightbox__close").focus();
  }

  function close() {
    overlay.hidden = true;
    document.body.style.overflow = "";
  }

  figures.forEach(function (fig, i) {
    var picture = fig.querySelector("picture");
    if (!picture) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "photo-grid__trigger";
    btn.setAttribute("aria-label", "View larger photo (" + (i + 1) + " of " + figures.length + ")");
    fig.insertBefore(btn, picture);
    btn.appendChild(picture);
    btn.addEventListener("click", function () {
      show(i);
    });
  });
})();
