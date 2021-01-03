var pwaSupport = false;

if ('serviceWorker' in navigator) {
    //register the serviceworker
    navigator.serviceWorker.register('sw.js').then(function(result){
        pwaSupport = true;
        console.log('service worker registered!');
        console.log('Scope: ' + result.scope);
        subscribeToPush();
        /*
        if('Notification' in window) {
            console.log('Notifications are supported!');
            Notification.requestPermission(function(status) {
                console.log('Notification status:  ' + status);
            });

            var options = {
                body:'See what\'s new',
                icon: 'android-chrome-192x192.png',
                data: {
                    timestamp: Date.now(),
                    loc: 'index.html#info'
                },
                actions: [
                    {action: 'go', title: 'go now'}
                ]
            };

            notify('Joehoe, hier een een mooie message', options);
        }
        */
    }, function(error){
        console.log('service worker registration failed');
        console.log(error);
    });
} else {
    console.log('Service worker not supported');
}

function notify(title, options) {
    if(Notification.permission === "granted") {
        console.log('in notify function');
        navigator.serviceWorker.ready.then(function(reg) {
            console.log('Ready to show notification...');
            reg.showNotification(title, options);
        });
    }
}


var installEvt;
window.addEventListener('beforeinstallprompt', function(e) {
    console.log('Beforeinstallprompt fired');
    installEvt = e;
    e.preventDefault();
    document.getElementById('addToHomeScreen').style.display = 'block';
});

function hidePrompt() {
    document.getElementById('addToHomeScreen').style.display = 'none';
}

function installApp(){
    console.log('Install App');
    hidePrompt();
    installEvt.prompt();
    installEvt.userChoice.then(function(result) {
        if (result.outcome === 'accepted') 
            console.log('Result outcome accepted');
        else 
            console.log('Result outcome not accepted, app not installed');
        
        
    });
}

window.addEventListener('appinstalled', function(e) {
    console.log('App installed event');
})

//IOS gebruikers weergeven van instructies om app aan homescreen toe te voegen.
window.onload = function() {
    if(pwaSupport) {
        var platform = navigator.platform;
        if(platform === "iPhone" || platform === "iPad" || platform === "iPod") {
            if(!navigator.standalone) {
                var lastShown = parseInt(localStorage.getItem('lastShown'));
                var now = new Date().getTime();
                if(isNaN(lastShown) || (lastShown + 1000*60*60*24*7 <= now)) {
                    document.getElementById('instructions').style.display = 'block';
                    localStorage.setItem('lastShown', now);
                }
            }
        }
    }
}

function hideInstructions() {
    document.getElementById('instructions').style.display = 'none';
}

function subscribeToPush() {
    console.log('In subscribeToPush');
    navigator.serviceWorker.ready.then(function(reg) {
        var subscription = {userVisibleOnly: true, applicationServerKey: "BKVg8SQZAteKBk7WOak46p23IVAJOHlzcpsg4zWmtjRd0HOnK5Vj0PSg__jAMdoDGeij1XCgwt3eb2vGYR0pHdk"};
        reg.pushManager.subscribe(subscription).then(function(sub) {
            console.log(JSON.stringify(sub));
            console.log('Endpoint: ' + sub.endpoint);
            console.log('the user has subscribed');
            console.log(JSON.stringify(subscription));

        });
    });
}