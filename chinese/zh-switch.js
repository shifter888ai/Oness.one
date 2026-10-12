(function () {
  function init() {
    if (document.getElementById("oness-zh-toggle")) return;
    var button = document.createElement("button");
    button.id = "oness-zh-toggle";
    button.type = "button";
    button.textContent = "简 / 繁";
    button.title = "简体中文 / 繁體中文";
    button.style.cssText = "position:fixed;top:12px;right:12px;z-index:99999;padding:8px 11px;border:1px solid #888;border-radius:999px;background:#f2f2f2;color:#222;font:14px Arial,sans-serif;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.16)";
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
          button.textContent = "简 / 繁 ⚠";
          busy = false; button.disabled = false; return;
        }
        convert = window.OpenCC.Converter({ from: "cn", to: "tw" });
        done();
      };
      s.onerror = function () {
        button.textContent = "简 / 繁 ⚠";
        button.title = "转换库加载失败，请检查网络连接";
        busy = false; button.disabled = false;
      };
      document.head.appendChild(s);
    }
    button.addEventListener("click", function () {
      if (busy) return;
      if (isTraditional) {
        saved.forEach(function (x) { if (x.node.isConnected) x.node.nodeValue = x.text; });
        isTraditional = false;
        button.textContent = "简 / 繁";
        return;
      }
      busy = true; button.disabled = true;
      load(function () {
        saved = nodes().map(function (n) { return { node: n, text: n.nodeValue }; });
        saved.forEach(function (x) { x.node.nodeValue = convert(x.text); });
        isTraditional = true;
        button.textContent = "繁 → 简";
        button.title = "点击恢复原始简体中文";
        busy = false; button.disabled = false;
      });
    });
    document.body.appendChild(button);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();