(function () {
  "use strict";

  function init() {
    if (document.getElementById("oness-shared-controls-ready")) return;

    var marker = document.createElement("meta");
    marker.id = "oness-shared-controls-ready";
    document.head.appendChild(marker);

    var style = document.createElement("style");
    style.id = "oness-shared-controls-style";
    style.textContent = [
      "body { transition: background-color .2s ease, color .2s ease; }",
      "body.oness-dark-mode { background-color: #171717 !important; color: #dddddd !important; }",
      "body.oness-dark-mode a { color: #9ecbff !important; }",
      "body.oness-dark-mode hr { border-color: #555 !important; }",
      "#theme-toggle, #back-to-top { border: 1px solid #888; box-shadow: 0 1px 4px rgba(0,0,0,.16); cursor: pointer; }",
      "#theme-toggle { position: fixed; top: 12px; right: 12px; z-index: 9999; width: 38px; height: 38px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #f2f2f2; color: #222; font: 20px/1 Arial, Helvetica, sans-serif; }",
      "body.oness-dark-mode #theme-toggle, body.oness-dark-mode #back-to-top { background: #303030; color: #f2f2f2; border-color: #777; }",
      "#back-to-top { position: fixed; right: 14px; bottom: 14px; z-index: 9998; width: 44px; height: 44px; border-radius: 50%; background: #f2f2f2; color: #222; font: 24px/1 Arial, Helvetica, sans-serif; display: none; align-items: center; justify-content: center; }",
      "#theme-toggle:focus-visible, #back-to-top:focus-visible { outline: 3px solid #4d90fe; outline-offset: 3px; }",
      "@media (prefers-reduced-motion: reduce) { body { transition: none; } }"
    ].join("\n");
    document.head.appendChild(style);

    var themeButton = document.getElementById("theme-toggle");
    var ownsThemeButton = !themeButton;
    if (!themeButton) {
      themeButton = document.createElement("button");
      themeButton.id = "theme-toggle";
      themeButton.type = "button";
      document.body.appendChild(themeButton);
    }

    var topButton = document.getElementById("back-to-top");
    var ownsTopButton = !topButton;
    if (!topButton) {
      topButton = document.createElement("button");
      topButton.id = "back-to-top";
      topButton.type = "button";
      topButton.setAttribute("aria-label", "Return to top");
      topButton.title = "Return to top";
      topButton.textContent = "↑";
      document.body.appendChild(topButton);
    }

    function applyTheme(theme) {
      document.body.classList.toggle("oness-dark-mode", theme === "dark");
      document.body.classList.toggle("dark-mode", theme === "dark");
      document.documentElement.style.colorScheme = theme;
      themeButton.textContent = theme === "dark" ? "☀" : "☾";
      themeButton.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }

    var saved = null;
    try { saved = localStorage.getItem("oness-theme"); } catch (e) {}
    applyTheme(saved === "dark" ? "dark" : "light");

    if (ownsThemeButton) {
      themeButton.addEventListener("click", function () {
        var next = document.body.classList.contains("oness-dark-mode") ? "light" : "dark";
        try { localStorage.setItem("oness-theme", next); } catch (e) {}
        applyTheme(next);
      });
    }

    function updateTopButton() {
      topButton.style.display = window.scrollY > 180 ? "flex" : "none";
    }
    window.addEventListener("scroll", updateTopButton, { passive: true });
    updateTopButton();

    if (ownsTopButton) {
      topButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();