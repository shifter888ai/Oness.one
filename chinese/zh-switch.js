(function () {
  function init() {
    if (document.getElementById("oness-zh-toggle")) return;
    var button = document.createElement("button");
    button.id = "oness-zh-toggle";
    button.type = "button";
    button.setAttribute("aria-label", "Switch between Simplified and Traditional Chinese");
    button.title = "Switch between Simplified and Traditional Chinese";
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 4.5h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3v-3.2a2 2 0 0 1-3-1.8v-7a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M10 8h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2l-3 2v-2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
    button.style.cssText = "position:fixed;top:12px;right:60px;z-index:99999;width:38px;height:38px;padding:0;display:flex;align-items:center;justify-content:center;border:1px solid #888;border-radius:50%;background:#f2f2f2;color:#222;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.16)";
    var iconStyle = document.createElement("style");
    iconStyle.textContent = "#oness-zh-toggle svg{width:21px;height:21px;display:block}body.oness-dark-mode #oness-zh-toggle{background:#303030!important;color:#f2f2f2!important;border-color:#777!important}#oness-zh-toggle:focus-visible{outline:3px solid #4d90fe;outline-offset:3px}";
    document.head.appendChild(iconStyle);

    var saved = [];
    var isTraditional = false;
    var convert = null;
    var busy = false;

    function nodes() {
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      var out = [], n;
      while ((n = walker.nextNode())) {
        if (!n.nodeValue.trim()) continue;
        var p = n.parentElement;
        if (p && !p.closest("script,style,noscript,textarea,input,select,option,button,pre,code,svg")) out.push(n);
      }
      return out;
    }
    function load(done) {
      if (convert) return done();
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.js";
      s.onload = function () {
        if (!window.OpenCC || !window.OpenCC.Converter) {
          busy = false; button.disabled = false; return;
        }
        convert = window.OpenCC.Converter({ from: "cn", to: "tw" });
        done();
      };
      s.onerror = function () {
        button.title = "Conversion library failed to load";
        busy = false; button.disabled = false;
      };
      document.head.appendChild(s);
    }
    button.addEventListener("click", function () {
      if (busy) return;
      if (isTraditional) {
        saved.forEach(function (x) { if (x.node.isConnected) x.node.nodeValue = x.text; });
        isTraditional = false;
        button.title = "Switch between Simplified and Traditional Chinese";
        button.setAttribute("aria-label", "Switch between Simplified and Traditional Chinese");
        return;
      }
      busy = true; button.disabled = true;
      load(function () {
        saved = nodes().map(function (n) { return { node: n, text: n.nodeValue }; });
        saved.forEach(function (x) { x.node.nodeValue = convert(x.text); });
        isTraditional = true;
        button.title = "Restore original Simplified Chinese";
        button.setAttribute("aria-label", "Restore original Simplified Chinese");
        busy = false; button.disabled = false;
      });
    });
    document.body.appendChild(button);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
