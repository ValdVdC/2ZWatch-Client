export const environment = {
  production: true,
  api: {
    baseUrl: 'https://twozwatch-server-5r65.onrender.com/api',
    serverUrl: 'https://twozwatch-server-5r65.onrender.com',
    timeout: 15000
  },
  tmdb: {
    imageBaseUrl: 'https://image.tmdb.org/t/p/'
  },
  cache: {
    duration: 10 * 60 * 1000, 
    maxSize: 200
  },
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50]
  },
  logLevel: 'warn' as const
};