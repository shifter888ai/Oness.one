export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("text/html")) return response;

    const pathname = new URL(request.url).pathname;
    const isChinesePage = pathname === "/chinese" || pathname.startsWith("/chinese/");
    const headers = new Headers(response.headers);
    headers.delete("content-length");
    headers.delete("content-encoding");

    // Legacy pages declare inconsistent encodings (including Shift_JIS), while
    // repository HTML content is UTF-8. Normalize decoding for every HTML page.
    const mediaType = contentType.split(";")[0].trim() || "text/html";
    headers.set("content-type", mediaType + "; charset=utf-8");

    const rewriter = new HTMLRewriter()
      .on("meta[charset]", {
        element(element) {
          element.remove();
        }
      })
      .on('meta[http-equiv="Content-Type"]', {
        element(element) {
          element.remove();
        }
      })
      .on("head", {
        element(element) {
          element.prepend('<meta charset="utf-8">', { html: true });
          element.append('<script src="/site-controls.js" defer></script>', { html: true });
          if (isChinesePage) {
            element.append('<script src="/chinese/zh-switch.js" defer></script>', { html: true });
          }
        }
      });

    return rewriter.transform(new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    }));
  }
};
