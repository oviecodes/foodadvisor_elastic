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

    // {
    //   method: 'GET',
    //   path: '/search/articles',
    //   handler: 'search.articles',
    //   config: {
    //     policies: [],
    //     middlewares: [],
    //     auth: false
    //   },
    // },

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
