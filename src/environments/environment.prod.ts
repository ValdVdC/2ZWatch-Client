export const environment = {
  production: true,
  api: {
    baseUrl: 'https://twozwatch-server.onrender.com/',
    timeout: 15000
  },
  tmdb: {
    imageBaseUrl: 'https://image.tmdb.org/t/p/'
  },
  cache: {
    duration: 10 * 60 * 1000, // 10 minutos
    maxSize: 200
  },
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50]
  }
};