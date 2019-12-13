//cache shell of site (core assets)
const staticCacheName = 'site-static-v1.2';
const assets = [
    '',
    'index.html',
    'pages/fallback.html',
    'js/app.js',
    'js/ui.js',
    'js/libs/materialize.min.js',
    'js/slider-screen.js',
    'js/libs/jquery-1.11.js',
    'js/libs/jquery-ui.min.js',
    'js/libs/snap.svg-min.js',
    'css/styles.css',
    'css/materialize.min.css',
    'css/slider-screen.css',
    'img/cto-logo.jpg',
    'img/ship.png',
    'img/icons/icon-256.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
];
//dynamic cache
const dynamicCacheName = 'site-dynamic-v1.2';

//limit cache size
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    });
}

//install service worker
self.addEventListener('install', evt => {
    //wait until site shell has been cached
    evt.waitUntil(
        caches.open(staticCacheName).then(cache =>{
            cache.addAll(assets); //cache all resources listed in assets array
        })
    );
});

//activate event
self.addEventListener('activate', evt =>{
    evt.waitUntil(
        caches.keys().then(keys =>{//check all caches
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName) //filter all caches that do not match static cache name
                .map(key => caches.delete(key))//delete old caches
            )
        })
    );
});

//fetch event
self.addEventListener('fetch', evt => {
    if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
      evt.respondWith(
        //if cached resource matches request serve it else continue with fetch
        caches.match(evt.request).then(cacheRes => {
          return cacheRes || fetch(evt.request).then(fetchRes => {
            return caches.open(dynamicCacheName).then(cache => {//get new response and cache in dynamic cache
              cache.put(evt.request.url, fetchRes.clone());
              // check cached items size
              limitCacheSize(dynamicCacheName, 15);//check dynamic cache size and remove items if too large
              return fetchRes;
            })
          });
        }).catch(() => {
          if(evt.request.url.indexOf('.html') > -1){//if can't find page return fallback
            return caches.match('pages/fallback.html');
          }
        })
      );
    }
});
