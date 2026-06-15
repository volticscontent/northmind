// Este arquivo anteriormente guardava a URL base para chamadas ao servidor Express externo.
// Como o backend foi 100% unificado no Next.js (Server Components e Route Handlers),
// as chamadas de API do cliente agora devem usar rotas relativas (ex: fetch('/api/...')).
// A constante API_URL foi removida para evitar que novos componentes tentem se conectar a portas externas (como a antiga 3001).

export {};
