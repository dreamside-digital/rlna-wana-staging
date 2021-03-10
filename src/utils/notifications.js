import firebase from "../firebase/init";

const SUBSCRIBE_ENDPOINT = 'https://us-central1-rlna-wana-staging.cloudfunctions.net/subscribeToNotifications'
const isClient = typeof window !== 'undefined';

const isNotificationsSupported = () => {
  if (isClient) {
    return Boolean('Notification' in window)
  } else {
    return false
  }
}

const notificationPermission = () => {
  if (isClient && isNotificationsSupported()) {
    return window.Notification.permission
  } else {
    return "not supported"
  }
}

const createNotification = (notification) => {
  if (!notification) return;

  if (isClient) {
    const n = new window.Notification(notification.title, {
      icon: notification.icon,
      body: notification.body,
      // requireInteraction: true,
    });

    n.addEventListener('click', () => {
      window.open(notification.click_action);
      n.close()
    })
  }
}

const initializeFirebaseMessaging = () => {
  console.log("Initializing firebase messaging in browser")
  import('firebase/messaging').then(() => {
    firebase.messaging().getToken().then((currentToken) => {
      if (currentToken) {
        console.log(currentToken)

        firebase.messaging().onMessage((payload) => {
          console.log(payload)
          if (payload.notification) {
            createNotification(payload.notification)
          }
        }, e => {
          console.log(e)
        })

      } else {
        // Show permission request.
        console.log(
          'No Instance ID token available. Request permission to generate one.')
      }
    })
  })
}

const subscribeToTopic = async (token) => {
  const repsonse = await fetch(`${SUBSCRIBE_ENDPOINT}?token=${token}`)
  console.log("Subscription request", repsonse)
}

const requestPermissionForNotifications = async (showNotification) => {
  try {
    await import('firebase/messaging')
    const messaging = firebase.messaging();
    const token = await messaging.getToken();
    console.log({token});
    if (token) {
      await subscribeToTopic(token)
      initializeFirebaseMessaging()
      showNotification('Success! You have been subscribed to our community notifications.')
    }

    return token;
  } catch (error) {
    console.error(error);
    showNotification('Sorry, we were not able to subscribe you to our notifications. Please try again.')
  }
}

export {
  requestPermissionForNotifications,
  notificationPermission,
  initializeFirebaseMessaging
}