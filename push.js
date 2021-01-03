var webPush = require('web-push');
var vapidKeys = webPush.generateVAPIDKeys();
var pushSub = {
                "endpoint":"https://fcm.googleapis.com/fcm/send/cFDsD_8aLXc:APA91bEdOaJuK0xvGinlDh2jbtpBya8nrjbX10-hKjAp9NQqvopykoKEzJNWBByk1i5F2bJZ9Irm8mH5GMznUgtKl8CV9ClRtXS-48ZHqxKCrfujtkRa3h6hlO9YQFl_xBxHv9m9bRnN",
                "expirationTime":null,
                "keys":{"p256dh":"BP6TcdOGSad74YuWS8M_nBXQUHXdzHmlGMPTz6ie6fcUkPjYZgz24AWF6SYCF6Jb3xnO7hF6MsJ70PypiftuPpQ","auth":"1KLfzdPVpKwG0sCxkJWPtA"
            }
        };
var vapidPublicKey = 'BKVg8SQZAteKBk7WOak46p23IVAJOHlzcpsg4zWmtjRd0HOnK5Vj0PSg__jAMdoDGeij1XCgwt3eb2vGYR0pHdk';
var convertedPublicVapidKey = urlBase64ToUint8Array(vapidPublicKey);
var vapidPrivateKey = 'taz7TtLIpR0Hc_-w-NBFlikWwuD7x2KlemoGs9gJ06U';
var convertedPrivateVapidKey = urlBase64ToUint8Array(vapidPrivateKey);     
webPush.setGCMAPIKey('1044754383724');
webPush.setVapidDetails(
  'mailto:example@yourdomain.org',
  //vapidKeys.convertedPublicVapidKey,
  //vapidKeys.convertedPrivateVapidKey
  vapidKeys.publicKey,
  vapidKeys.privateKey
);


function urlBase64ToUint8Array(base64String) {
    var atob = require('atob');
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    var rawData = atob(base64);
    var outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  webPush.sendNotification(pushSub, 'Your Push Payload Text');
   
