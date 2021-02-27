import firebase from "../firebase/init";

const MAX_NOTIFICATION_VIEWS = 3

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

const handleClose = (id) => {
  const storedQueue = window.localStorage.getItem('connect-wana-notifications')
  let notificationQueue = storedQueue ? JSON.parse(storedQueue) : {}
  const newQueue = {
    ...notificationQueue,
    [id]: {
      ...notificationQueue[id],
      closed: true
    }
  }
  window.localStorage.setItem('connect-wana-notifications', JSON.stringify(newQueue))
}

const playNotifications = async () => {
  const allNotifications = await fetchBrowserNotifications()
  const notifArr = Object.keys(allNotifications).map(k => allNotifications[k])
  const storedQueue = window.localStorage.getItem('connect-wana-notifications')
  let notificationQueue = storedQueue ? JSON.parse(storedQueue) : {}

  notifArr.forEach(notif => {
    const notificationStatus = notificationQueue[notif.id]
    if (!notificationStatus || (notificationStatus.displayCount <= MAX_NOTIFICATION_VIEWS && !notificationStatus.closed)) {
      const n = new window.Notification(notif.message, { image: notif.image, icon: "https://connect-wana.online/icon.png" });

      n.addEventListener('click', () => {
        window.open(notif.url);
      })

      n.addEventListener('close', () => {
        handleClose(notif.id)
      })

      if (notificationQueue[notif.id]) {
        notificationQueue[notif.id].displayCount++
      } else {
        notificationQueue[notif.id] = {
          displayCount: 1,
          closed: false
        }
      }
    }
  })

  console.log("notificationQueue", notificationQueue)

  window.localStorage.setItem('connect-wana-notifications', JSON.stringify(notificationQueue))
}


export {
  requestPermissionForNotifications,
  playNotifications,
  notificationPermission
}