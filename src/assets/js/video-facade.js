(function () {
  document.querySelectorAll(".video-facade").forEach(function (facade) {
    facade.addEventListener("click", function (event) {
      event.preventDefault();
      var videoId = facade.getAttribute("data-video-id");
      var playlistId = facade.getAttribute("data-playlist-id");
      var title = facade.getAttribute("data-video-title") || "Video";
      var iframe = document.createElement("iframe");
      iframe.src = playlistId
        ? "https://www.youtube-nocookie.com/embed/videoseries?list=" + playlistId + "&autoplay=1"
        : "https://www.youtube-nocookie.com/embed/" + videoId + "?autoplay=1";
      iframe.title = title;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      facade.innerHTML = "";
      facade.appendChild(iframe);
    });
  });
})();
