var cacheName = 'CSv94';

var cachedFiles = [
    '/',
    'index.html',
    'manifest.json',
    'main.js',
    //'/css/main.css',
    '/img/x34xcs7asctr_std1024.jpg'
];

self.addEventListener('install', function(e) {
    console.log('Service Worker install event');
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log('Caching files');
            return cache.addAll(cachedFiles);
        }).then(function() {
            return self.skipWaiting();
        }).catch(function(error) {
            console.log('Cache failed '.error);
        })
    );
});

self.addEventListener('activate', function(e) {
    console.log('Serviceworker activated');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key){
                if(key !== cacheName) {
                    console.log('Removing old cache', key);
                    return caches.delete(key);
                }
            }));

        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(e){
    console.log('Fetch event occured' + e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(response){
            return response || fetch(e.request);
        })
    );
});

function closeNotification(msg, evt) {
    console.log('msg: ', msg, 'evt: ', evt.notification.data);
    evt.notification.close();
}

self.addEventListener('notificationclose', function(e) {
    closeNotification('Notification closed', e);
});

self.addEventListener('notificationclick', function(e) {
    if(e.action !== 'close') {
        e.waitUntil(
            self.clients.matchAll({type: 'window', includeUncontrolled: 'true'}).then(function(allClients) {
                console.log(allClients);
                var matchingClient = null;
                for(var i = 0; i < allClients.length; i++) {
                    if(allClients[i].visibilityState === 'visible') {
                        console.log('Navigating');
                        matchingClient = allClients[i];
                        matchingClient.navigate(e.notification.data.loc);
                        break;
                    }
                }
                if(matchingClient === null) {
                    //No visible client
                    console.log('open the location');
                    self.clients.openWindow(e.notification.data.loc);
                }
            })
        );
    }
    closeNotification('Notification Clicked', e);
});

self.addEventListener('push', function(e) {
    console.log("we received a push message!");
    var loc;
    if(e.data) {
        console.log("data received");
        console.log(e.data.text());
        loc = e.data.text();
    } else {
        loc = "index.html#info";
    }
    var options = {
        body:'See what\'s new',
        icon: 'android-chrome-192x192.png',
        data: {
            timestamp: Date.now(),
            loc: loc
        },
        actions: [
            {action: 'go', title: 'go now'}
        ]
    };
    e.waitUntil(self.ServiceWorkerRegistration.showNotification('Opleidingen en training', options)     
    );
});