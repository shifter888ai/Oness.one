export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return response;

    const pathname = new URL(request.url).pathname;
    const isChinesePage = pathname === "/chinese" || pathname.startsWith("/chinese/");
    const headers = new Headers(response.headers);
    headers.delete("content-length");
    headers.delete("content-encoding");

    let rewriter = new HTMLRewriter().on("head", {
      element(element) {
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
