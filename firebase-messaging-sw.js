// firebase-messaging-sw.js
// Give the service worker access to Firebase SDKs
// Make sure to use the exact same Firebase SDK versions as in your main HTML file.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// Your Firebase project configuration
// This should be the SAME firebaseConfig object from your main HTML file.
const firebaseConfig = {
    apiKey: "AIzaSyBbyAD6CG1kR0iaSx7gLwT3TfUvzbzWEQs",
    authDomain: "airmates-72301.firebaseapp.com",
    projectId: "airmates-72301",
    storageBucket: "airmates-72301.firebasestorage.app",
    messagingSenderId: "957276653373",
    appId: "1:957276653373:web:866e0c7db26c35aa6c6754",
    measurementId: "G-7FVF90T0K0"
};

// Initialize the Firebase app in the service worker
firebase.initializeApp(firebaseConfig);

// Retrieve a Firebase Messaging object.
// This is required to activate the `onBackgroundMessage` handler.
const messaging = firebase.messaging();

// Handle incoming messages when the app is in the background.
// Notifications will be displayed automatically by the browser/OS if they have a 'notification' payload.
// This `onBackgroundMessage` is specifically for handling the 'data' payload when the app is not active.
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // Customize notification here
    const notificationTitle = payload.notification.title || 'New Message';
    const notificationOptions = {
        body: payload.notification.body || 'You have a new message.',
        icon: '/firebase-logo.png', // Optional: path to your notification icon
        data: payload.data // Pass along any custom data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: Intercept and handle notification click events
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification click received.', event);
    event.notification.close(); // Close the notification

    // Example: Open a specific URL when the notification is clicked
    if (event.action === 'open_url') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/') // Open the URL from the data payload, or root
        );
    } else {
        // Fallback to opening the main window/tab
        event.waitUntil(
            clients.matchAll({
                type: 'window',
                includeUncontrolled: true
            }).then((clientList) => {
                for (const client of clientList) {
                    if (client.url && 'focus' in client) {
                        return client.focus();
                    }
                }
                return clients.openWindow('/'); // Open a new window if none found
            })
        );
    }
});
