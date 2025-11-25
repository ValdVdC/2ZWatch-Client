export const environment = {
  production: false,
  api: {
    baseUrl: 'http://localhost:3000/api',
    serverUrl: 'http://localhost:3000',
    timeout: 10000
  },
  tmdb: {
    imageBaseUrl: 'https://image.tmdb.org/t/p/'
  },
  cache: {
    duration: 5 * 60 * 1000, // 5 minutos
    maxSize: 100
  },
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50]
  },
  logLevel: 'debug' as const
};