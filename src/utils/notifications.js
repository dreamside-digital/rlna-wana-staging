import firebase from "../firebase/init";

const MAX_NOTIFICATION_VIEWS = 100

const isNotificationsSupported = () => Boolean('Notification' in window)

const notificationPermission = () => {
  return window.localStorage.getItem('connect-wana-notifications-permission') || "default"
}

const fetchBrowserNotifications = async() => {
  const db = firebase.database();

  const firebaseQuery = await db.ref(`notifications`).once('value')
  return firebaseQuery.val()
}

const requestPermissionForNotifications = async () => {
  if (!isNotificationsSupported()) {
    return
  }

  const permission = await window.Notification.requestPermission()
  window.localStorage.setItem('connect-wana-notifications-permission', permission)

  if (permission === "granted") {
    playNotifications()
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


export {
  requestPermissionForNotifications,
  playNotifications,
  notificationPermission
}