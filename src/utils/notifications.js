import firebase from "../firebase/init";

const MAX_NOTIFICATION_VIEWS = 3

const isNotificationsSupported = () => Boolean('Notification' in window)

const notificationPermission = () => {
  return window.localStorage.getItem('connect-wana-notifications-permission') || "default"
}

const createNotification = (notification) => {
  if (!notification) return;
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

const initializeFirebaseMessaging = () => {
  console.log("initializeing firebase messaging in browser")
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
}

const fetchBrowserNotifications = async() => {
  const db = firebase.database();

  const firebaseQuery = await db.ref(`notifications`).once('value')
  return firebaseQuery.val()
}

const requestPermissionForNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    const token = await messaging.getToken();
    console.log({token});

    return token;
  } catch (error) {
    console.error(error);
  }
}

const playNotification = (index, notificationsToPlay, queue) => {
  console.log({index})
  if (index === notificationsToPlay.length) {
    console.log("queue to save", queue)
    return window.localStorage.setItem('connect-wana-notifications', JSON.stringify(queue))
  }

  const notification = notificationsToPlay[index];

  if (queue[notification.id]) {
    queue[notification.id].displayCount++
  } else {
    queue[notification.id] = {
      displayCount: 1,
      closed: false
    }
  }

  window.localStorage.setItem('connect-wana-notifications', JSON.stringify(queue))

  const n = new window.Notification(notification.title, {
    icon: "https://connect-wana.online/icon.png",
    body: notification.message,
    // requireInteraction: true,
  });

  n.addEventListener('click', () => {
    window.open(notification.url);
    n.close()
  })

  n.addEventListener('close', () => {
    queue[notification.id] = {
      ...queue[notification.id],
      closed: true
    }
    playNotification(index+1, notificationsToPlay, queue)
  })
}

const playNotifications = async () => {
  const allNotifications = await fetchBrowserNotifications()

  if (!allNotifications) return false;

  const storedQueue = window.localStorage.getItem('connect-wana-notifications')
  let notificationQueue = storedQueue ? JSON.parse(storedQueue) : {}

  const notificationsToPlay = Object.keys(allNotifications)
    .map(k => allNotifications[k])
    .filter(n => {
      const notificationStatus = notificationQueue[n.id]
      return (n.active && (!notificationStatus || (notificationStatus.displayCount <= MAX_NOTIFICATION_VIEWS && !notificationStatus.closed)))
    })

  console.log({notificationsToPlay})

  playNotification(0, notificationsToPlay, notificationQueue)
}

const getRegistrationToken = () => {
  console.log("getting registration token")
  const messaging = firebase.messaging();
  messaging.getToken({ vapidKey: 'BFETNTM1gtRZcwkneelR_kfi1L1iIRC65KSVisO1s8mqvGGgXc0dPwTrJZUXZHZ28IvuZ0wVcKQRZ-5heeFtCwQ' }).then((currentToken) => {
    if (currentToken) {
      console.log({currentToken})
      // Send the token to your server and update the UI if necessary
      // ...
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // ...
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });
}


export {
  requestPermissionForNotifications,
  playNotifications,
  notificationPermission,
  initializeFirebaseMessaging
}