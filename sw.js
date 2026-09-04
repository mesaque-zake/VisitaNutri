const CACHE_NAME = 'visitas-nutricionais-v1';
const ASSETS = [
  './index.html',
  './app.jsx',
  './style.css',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './favicon.ico'
];

// Instalação do Service Worker e cache inicial dos arquivos locais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Ativação e limpeza de caches antigos se mudarmos a versão do app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepta as requisições para permitir o funcionamento offline
self.addEventListener('fetch', (event) => {
  // Ignora requisições que não sejam GET (como o envio dos formulários por POST ao Google Sheets)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a requisição à rede funcionar, guarda uma cópia no cache dinâmico
        if (response && response.status === 200) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseCopy);
          });
        }
        return response;
      })
      .catch(() => {
        // Se falhar a rede (offline), busca a cópia salva no cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Caso não haja nada no cache, retorna falha silenciosa
        });
      })
  );
});
