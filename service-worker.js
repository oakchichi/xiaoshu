var CACHE_NAME = "xiaoshu-kaoyan-buddy-v93";
var ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/bear-study.gif",
  "./assets/bear-flower.jpg",
  "./assets/bear-lie.gif",
  "./assets/bear-cheer.gif",
  "./assets/bear-persist.gif",
  "./assets/bear-lazy.gif",
  "./assets/bear-breakdown.gif",
  "./assets/bear-hula.gif",
  "./assets/bear-panic.gif",
  "./assets/bear-shine.gif",
  "./assets/quote-bear-01.gif",
  "./assets/quote-bear-02.gif",
  "./assets/quote-bear-03.gif",
  "./assets/quote-bear-04.gif",
  "./assets/quote-bear-05.gif",
  "./assets/quote-bear-06.gif",
  "./assets/quote-bear-07.gif",
  "./assets/quote-bear-08.gif",
  "./assets/quote-bear-09.gif",
  "./assets/quote-bear-10.gif",
  "./assets/quote-bear-11.gif",
  "./assets/quote-bear-12.gif",
  "./assets/quote-bear-13.gif",
  "./assets/quote-bear-14.gif",
  "./assets/quote-bear-15.gif",
  "./assets/quote-bear-16.gif",
  "./assets/quote-extras/quote-extra-01.gif",
  "./assets/quote-extras/quote-extra-02.gif",
  "./assets/quote-extras/quote-extra-03.gif",
  "./assets/quote-extras/quote-extra-04.gif",
  "./assets/quote-extras/quote-extra-05.gif",
  "./assets/quote-extras/quote-extra-06.gif",
  "./assets/quote-extras/quote-extra-07.gif",
  "./assets/quote-extras/quote-extra-08.gif",
  "./assets/quote-extras/quote-extra-09.gif",
  "./assets/quote-extras/quote-extra-10.gif",
  "./assets/quote-extras/quote-extra-11.gif",
  "./assets/quote-extras/quote-extra-12.gif",
  "./assets/quote-extras/quote-extra-13.gif",
  "./assets/quote-extras/quote-extra-14.gif",
  "./assets/quote-extras/quote-extra-15.gif",
  "./assets/new-bears/bear-new-01.gif",
  "./assets/new-bears/bear-new-02.gif",
  "./assets/new-bears/bear-new-03.gif",
  "./assets/new-bears/bear-new-04.gif",
  "./assets/new-bears/bear-new-05.gif",
  "./assets/new-bears/bear-new-06.gif",
  "./assets/new-bears/bear-new-07.gif",
  "./assets/new-bears/bear-new-08.gif",
  "./assets/new-bears/bear-new-09.gif",
  "./assets/new-bears/bear-new-10.gif",
  "./assets/new-bears/bear-new-11.gif",
  "./assets/nav-icons/nav-home.png",
  "./assets/nav-icons/nav-western.png",
  "./assets/nav-icons/nav-english.png",
  "./assets/nav-icons/nav-politics.png",
  "./assets/nav-icons/nav-leisure.png",
  "./assets/nav-icons/nav-stats.png",
  "./assets/nav-icons/nav-settings.png",
  "./assets/tomatodo-import-v61.js",
  "./assets/study-plan-v80.js"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("message", function(event) {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== CACHE_NAME;
        }).map(function(key) {
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") return;
  var url = new URL(event.request.url);
  var isSameOrigin = url.origin === self.location.origin;
  var acceptsHtml = event.request.headers.get("accept") || "";
  var isPageRequest = event.request.mode === "navigate" || acceptsHtml.indexOf("text/html") !== -1;

  if (isSameOrigin && isPageRequest) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, copy);
          cache.put("./index.html", response.clone());
        });
        return response;
      }).catch(function() {
        return caches.match(event.request).then(function(cached) {
          return cached || caches.match("./index.html");
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request).then(function(response) {
      if (isSameOrigin && response && response.status === 200) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, copy);
        });
      }
      return response;
    }).catch(function() {
      return caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        if (isPageRequest) return caches.match("./index.html");
        return new Response("", { status: 504, statusText: "Offline" });
      });
    })
  );
});
