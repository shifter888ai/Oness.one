(function () {
  "use strict";
  function init() {
    if (window.self !== window.top) return;
    if (document.getElementById("oness-shared-controls-ready")) return;

    var root = document.body || document.documentElement;
    if (!root) return;
    var marker = document.createElement("meta");
    marker.id = "oness-shared-controls-ready";
    (document.head || document.documentElement).appendChild(marker);

    var style = document.createElement("style");
    style.textContent = [
      "body,html { transition: background-color .2s ease, color .2s ease; }",
      "body.oness-dark-mode,html.oness-dark-mode { background-color:#171717 !important;color:#ddd !important; }",
      "body.oness-dark-mode a { color:#9ecbff !important; }",
      "body.oness-dark-mode hr { border-color:#555 !important; }",
      "#theme-toggle,#back-to-top { border:1px solid #888;box-shadow:0 1px 4px rgba(0,0,0,.16);cursor:pointer;box-sizing:border-box; }",
      "#theme-toggle { position:fixed;top:12px;right:12px;z-index:2147483647;width:38px;height:38px;padding:0;display:flex;align-items:center;justify-content:center;border-radius:50%;background:#f2f2f2;color:#222; }",
      "body.oness-dark-mode #theme-toggle,html.oness-dark-mode #theme-toggle { background:#303030;color:#f2f2f2;border-color:#777; }",
      "#theme-toggle svg { width:21px;height:21px;display:block; }",
      "#back-to-top { position:fixed;right:14px;bottom:14px;z-index:2147483646;width:44px;height:44px;border-radius:50%;background:#f2f2f2;color:#222;display:none;align-items:center;justify-content:center; }",
      "body.oness-dark-mode #back-to-top,html.oness-dark-mode #back-to-top { background:#303030;color:#f2f2f2;border-color:#777; }",
      "#back-to-top svg { width:22px;height:22px;display:block; }",
      "#theme-toggle:focus-visible,#back-to-top:focus-visible { outline:3px solid #4d90fe;outline-offset:3px; }"
    ].join("\n");
    (document.head || document.documentElement).appendChild(style);

    var themeButton = document.getElementById("theme-toggle");
    var ownsTheme = !themeButton;
    if (!themeButton) { themeButton = document.createElement("button"); themeButton.id = "theme-toggle"; themeButton.type = "button"; root.appendChild(themeButton); }
    var topButton = document.getElementById("back-to-top");
    var ownsTop = !topButton;
    if (!topButton) { topButton = document.createElement("button"); topButton.id = "back-to-top"; topButton.type = "button"; root.appendChild(topButton); }
    topButton.setAttribute("aria-label", "Return to top");
    topButton.title = "Return to top";
    topButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function eachDocument(callback) {
      callback(document);
      var frames = document.querySelectorAll("frame,iframe");
      for (var i = 0; i < frames.length; i++) {
        try { if (frames[i].contentDocument) callback(frames[i].contentDocument); } catch (e) {}
      }
    }
    function applyTheme(theme) {
      eachDocument(function (doc) {
        if (doc.documentElement) {
          doc.documentElement.classList.toggle("oness-dark-mode", theme === "dark");
          doc.documentElement.style.colorScheme = theme;
        }
        if (doc.body) {
          doc.body.classList.toggle("oness-dark-mode", theme === "dark");
          doc.body.classList.toggle("dark-mode", theme === "dark");
        }
      });
      themeButton.innerHTML = theme === "dark"
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
      themeButton.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      themeButton.title = themeButton.getAttribute("aria-label");
    }
    var saved = null;
    try { saved = localStorage.getItem("oness-theme"); } catch (e) {}
    applyTheme(saved === "dark" ? "dark" : "light");
    if (ownsTheme) themeButton.addEventListener("click", function () {
      var next = document.documentElement.classList.contains("oness-dark-mode") ? "light" : "dark";
      try { localStorage.setItem("oness-theme", next); } catch (e) {}
      applyTheme(next);
    });

    function scrollFramesToTop() {
      var scrolled = false;
      var frames = document.querySelectorAll("frame,iframe");
      for (var i = 0; i < frames.length; i++) {
        try {
          var win = frames[i].contentWindow;
          if (win && win.scrollY > 0) { win.scrollTo({ top: 0, behavior: "smooth" }); scrolled = true; }
        } catch (e) {}
      }
      if (!scrolled) window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (ownsTop) topButton.addEventListener("click", scrollFramesToTop);
    function updateTop() {
      var visible = window.scrollY > 180;
      var frames = document.querySelectorAll("frame,iframe");
      for (var i = 0; i < frames.length; i++) {
        try { if (frames[i].contentWindow.scrollY > 180) visible = true; } catch (e) {}
      }
      topButton.style.display = visible ? "flex" : "none";
    }
    function watchFrames() {
      var frames = document.querySelectorAll("frame,iframe");
      for (var i = 0; i < frames.length; i++) {
        try { frames[i].contentWindow.addEventListener("scroll", updateTop, { passive: true }); } catch (e) {}
        frames[i].addEventListener("load", function () {
          try { frames[i].contentWindow.addEventListener("scroll", updateTop, { passive: true }); } catch (e) {}
          var theme = document.documentElement.classList.contains("oness-dark-mode") ? "dark" : "light";
          applyTheme(theme);
          updateTop();
        });
      }
    }
    window.addEventListener("scroll", updateTop, { passive: true });
    watchFrames();
    updateTop();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
