self.addEventListener('push', function (event) {
  const data = event.data.json();

  const options = {
    body: data.message,
    icon: '/vite.svg',  // Asegúrate de tener esta imagen en la carpeta 'public'
    badge: '/badge.png', // Imagen pequeña opcional
    data: { appointmentId: data.appointmentId },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('push', function (event) {
  const data = event.data.json();
  const options = {
    body: data.message,
    icon: '/vite.svg',
    badge: '/badge.png',
    data: { appointmentId: data.appointmentId },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
