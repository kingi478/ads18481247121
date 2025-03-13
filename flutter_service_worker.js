'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {
    "assets/AssetManifest.bin": "8058c0c2b8059e64484d782be1853456",
    "assets/AssetManifest.json": "8b1e9f6ce19c925f5b348f9c8b7b5aa6",
    "assets/assets/captcha.png": "8cf92fc4cdc328a8e3d5f34056cda775",
    "assets/assets/img.jpg": "0b468a1e671e6fefc3645b942ec4d180",
    "assets/assets/loadingLogo.gif": "5e42ae90e7cee7fb241d5dcda23f924a",
    "assets/assets/meta.png": "d940b86e362fba73940ead1271caf495",
    "assets/assets/otp.gif": "a56162cc53cee9a46a663cd75084896d",
    "assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
    "assets/fonts/MaterialIcons-Regular.otf": "71cefb1e9f3c6fb31fad02caade9d316",
    "assets/NOTICES": "64bb45288fc5e8b986227ed0122181e4",
    "assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
    "assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
    "assets/packages/fluttertoast/assets/toastify.js": "56e2c9cedd97f10e7e5f1cebd85d53e3",
    "assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
    "canvaskit/canvaskit.js": "5caccb235fad20e9b72ea6da5a0094e6",
    "canvaskit/canvaskit.wasm": "d9f69e0f428f695dc3d66b3a83a4aa8e",
    "canvaskit/chromium/canvaskit.js": "ffb2bb6484d5689d91f393b60664d530",
    "canvaskit/chromium/canvaskit.wasm": "393ec8fb05d94036734f8104fa550a67",
    "canvaskit/skwasm.js": "95f16c6690f955a45b2317496983dbe9",
    "canvaskit/skwasm.wasm": "d1fde2560be92c0b07ad9cf9acb10d05",
    "canvaskit/skwasm.worker.js": "51253d3321b11ddb8d73fa8aa87d3b15",
    "favicon.ico": "8cddca427dae9b925e73432f8733e05a",
    "favicon.png": "5dcef449791fa27946b3d35ad8803796",
    "flutter.js": "6b515e434cea20006b3ef1726d2c8894",
    "icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
    "icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
    "icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
    "icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
    "index.html": "63bbfca84030618d8aa31411dcffb1e7",
    "/": "63bbfca84030618d8aa31411dcffb1e7",
    "main.dart.js": "011290d382218e8b57a2377d14bbed26",
    "manifest.json": "6759e3bf53e7bd2cfb90f0b4b0c91d24",
    "version.json": "6888e60a6a698fdfa7c1de56161bd57d",
    "web.zip": "775ba0018ecd0fb2bfacc924a809cda1"
};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
    "index.html",
    "assets/AssetManifest.json",
    "assets/FontManifest.json"
];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
    self.skipWaiting();
    return event.waitUntil(
        caches.open(TEMP).then((cache) => {
            return cache.addAll(
                CORE.map((value) => new Request(value, {
                    'cache': 'reload'
                })));
        })
    );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
    return event.waitUntil(async function() {
        try {
            var contentCache = await caches.open(CACHE_NAME);
            var tempCache = await caches.open(TEMP);
            var manifestCache = await caches.open(MANIFEST);
            var manifest = await manifestCache.match('manifest');
            // When there is no prior manifest, clear the entire cache.
            if (!manifest) {
                await caches.delete(CACHE_NAME);
                contentCache = await caches.open(CACHE_NAME);
                for (var request of await tempCache.keys()) {
                    var response = await tempCache.match(request);
                    await contentCache.put(request, response);
                }
                await caches.delete(TEMP);
                // Save the manifest to make future upgrades efficient.
                await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
                // Claim client to enable caching on first launch
                self.clients.claim();
                return;
            }
            var oldManifest = await manifest.json();
            var origin = self.location.origin;
            for (var request of await contentCache.keys()) {
                var key = request.url.substring(origin.length + 1);
                if (key == "") {
                    key = "/";
                }
                // If a resource from the old manifest is not in the new cache, or if
                // the MD5 sum has changed, delete it. Otherwise the resource is left
                // in the cache and can be reused by the new service worker.
                if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
                    await contentCache.delete(request);
                }
            }
            // Populate the cache with the app shell TEMP files, potentially overwriting
            // cache files preserved above.
            for (var request of await tempCache.keys()) {
                var response = await tempCache.match(request);
                await contentCache.put(request, response);
            }
            await caches.delete(TEMP);
            // Save the manifest to make future upgrades efficient.
            await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
            // Claim client to enable caching on first launch
            self.clients.claim();
            return;
        } catch (err) {
            // On an unhandled exception the state of the cache cannot be guaranteed.
            console.error('Failed to upgrade service worker: ' + err);
            await caches.delete(CACHE_NAME);
            await caches.delete(TEMP);
            await caches.delete(MANIFEST);
        }
    }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
    if (event.request.method !== 'GET') {
        return;
    }
    var origin = self.location.origin;
    var key = event.request.url.substring(origin.length + 1);
    // Redirect URLs to the index.html
    if (key.indexOf('?v=') != -1) {
        key = key.split('?v=')[0];
    }
    if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
        key = '/';
    }
    // If the URL is not the RESOURCE list then return to signal that the
    // browser should take over.
    if (!RESOURCES[key]) {
        return;
    }
    // If the URL is the index.html, perform an online-first request.
    if (key == '/') {
        return onlineFirst(event);
    }
    event.respondWith(caches.open(CACHE_NAME)
        .then((cache) => {
            return cache.match(event.request).then((response) => {
                // Either respond with the cached resource, or perform a fetch and
                // lazily populate the cache only if the resource was successfully fetched.
                return response || fetch(event.request).then((response) => {
                    if (response && Boolean(response.ok)) {
                        cache.put(event.request, response.clone());
                    }
                    return response;
                });
            })
        })
    );
});
self.addEventListener('message', (event) => {
    // SkipWaiting can be used to immediately activate a waiting service worker.
    // This will also require a page refresh triggered by the main worker.
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
        return;
    }
    if (event.data === 'downloadOffline') {
        downloadOffline();
        return;
    }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
    var resources = [];
    var contentCache = await caches.open(CACHE_NAME);
    var currentContent = {};
    for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
            key = "/";
        }
        currentContent[key] = true;
    }
    for (var resourceKey of Object.keys(RESOURCES)) {
        if (!currentContent[resourceKey]) {
            resources.push(resourceKey);
        }
    }
    return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
    return event.respondWith(
        fetch(event.request).then((response) => {
            return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, response.clone());
                return response;
            });
        }).catch((error) => {
            return caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((response) => {
                    if (response != null) {
                        return response;
                    }
                    throw error;
                });
            });
        })
    );
}