var CACHE_NAME = "xiaoshu-kaoyan-buddy-v100";

// 核心资源：安装时立即缓存（体积小，首屏必需）
var CRITICAL_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/bear-study.gif",
  "./assets/bear-cheer.gif",
  "./assets/bear-flower.jpg",
  "./assets/bear-flower-latest.jpg",
  "./assets/nav-icons/nav-home.png",
  "./assets/nav-icons/nav-western.png",
  "./assets/nav-icons/nav-english.png",
  "./assets/nav-icons/nav-politics.png",
  "./assets/nav-icons/nav-stats.png",
  "./assets/nav-icons/nav-leisure.png",
  "./assets/nav-icons/nav-settings.png",
  "./assets/new-bears/bear-new-07.gif",
  "./assets/tomatodo-import-v61.js",
  "./assets/study-plan-v81.js",
  "./assets/leisure-materials.js"
];

// 非核心资源：安装后后台缓存（体积大，非首屏必需）
var LAZY_ASSETS = [
  "./assets/bear-lie.gif",
  "./assets/bear-persist.gif",
  "./assets/bear-lazy.gif",
  "./assets/bear-breakdown.gif",
  "./assets/bear-hula.gif",
  "./assets/bear-panic.gif",
  "./assets/bear-shine.gif",
  "./assets/bear-flower-2.jpg",
  "./assets/bear-mask.gif",
  "./assets/bear-read.gif",
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
  "./assets/new-bears/bear-new-08.gif",
  "./assets/new-bears/bear-new-09.gif",
  "./assets/new-bears/bear-new-10.gif",
  "./assets/new-bears/bear-new-11.gif"
];

// 安装时只缓存核心资源，不阻塞
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.allSettled(
        CRITICAL_ASSETS.map(function(asset) {
          return cache.add(asset).catch(function(err) {
            console.warn("核心缓存失败:", asset, err.message);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("message", function(event) {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// 激活时清除旧缓存，后台预热非核心资源
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
    }).then(function() {
      self.clients.claim();
      // 后台预热非核心资源（不阻塞激活）
      caches.open(CACHE_NAME).then(function(cache) {
        LAZY_ASSETS.forEach(function(asset) {
          cache.match(asset).then(function(cached) {
            if (!cached) {
              fetch(asset).then(function(resp) {
                if (resp && resp.status === 200) {
                  cache.put(asset, resp.clone());
                }
              }).catch(function() {});
            }
          }).catch(function() {});
        });
      });
    })
  );
});

// 判断是否为静态资源
function isStaticAsset(url) {
  var pathname = url.pathname.toLowerCase();
  return (
    pathname.endsWith(".gif") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".webp") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".json") ||
    pathname.endsWith(".woff") ||
    pathname.endsWith(".woff2") ||
    pathname.endsWith(".ttf") ||
    pathname.endsWith(".ico")
  );
}

self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") return;
  var url = new URL(event.request.url);
  var isSameOrigin = url.origin === self.location.origin;
  var acceptsHtml = event.request.headers.get("accept") || "";
  var isPageRequest = event.request.mode === "navigate" || acceptsHtml.indexOf("text/html") !== -1;

  // HTML 页面：network-first（保证能拿到最新版本）
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

  // 静态资源：cache-first（优先用缓存，缓存没有才请求网络）
  if (isSameOrigin && isStaticAsset(url)) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) {
          // 缓存命中，直接返回（同时在后台更新缓存）
          fetch(event.request).then(function(response) {
            if (response && response.status === 200) {
              caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, response.clone());
              });
            }
          }).catch(function() {});
          return cached;
        }
        // 缓存未命中，从网络获取并缓存
        return fetch(event.request).then(function(response) {
          if (response && response.status === 200) {
            var copy = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, copy);
            });
          }
          return response;
        }).catch(function() {
          return new Response("", { status: 504, statusText: "Offline" });
        });
      })
    );
    return;
  }

  // 其他同源请求：cache-first with network update
  if (isSameOrigin) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) {
          fetch(event.request).then(function(response) {
            if (response && response.status === 200) {
              caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, response.clone());
              });
            }
          }).catch(function() {});
          return cached;
        }
        return fetch(event.request).then(function(response) {
          if (response && response.status === 200) {
            var copy = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, copy);
            });
          }
          return response;
        }).catch(function() {
          return new Response("", { status: 504, statusText: "Offline" });
        });
      })
    );
    return;
  }

  // 跨域请求：直接走网络
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(cached) {
        return cached || new Response("", { status: 504, statusText: "Offline" });
      });
    })
  );
});
