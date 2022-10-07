module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/search/restaurants',
     handler: 'search.restaurants',
     config: {
       policies: [],
       middlewares: [],
       auth: false
     },
    },

    {
      method: 'POST',
      path: '/search/restaurants',
      handler: 'search.search_restaurants',
      config: {
        policies: [],
        middlewares: [],
        auth: false
      },
     },
  ],
};
