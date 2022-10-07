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
  ],
};
