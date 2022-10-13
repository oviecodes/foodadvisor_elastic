'use strict';

/**
 * A set of functions called "actions" for `search`
 */

module.exports = {
  restaurants: async (ctx, next) => {
    try {
      const data = await strapi.service('api::search.search').restaurants()
      // console.log('here', data)
      ctx.body = data
    } catch (err) {
      ctx.body = err;
    }
  },

  articles: async(ctx, next) => {

    try {
      const data = await strapi.service('api::search.search').articles()
      // console.log('here', data)
      ctx.body = data
    } catch (err) {
      ctx.body = err;
    }

  },

  search_restaurants: async(ctx, next) => {
    try {
      const data = await strapi.service('api::search.search').search_restaurants(ctx.query)
      // console.log('here', ctx.query)
      ctx.body = data
    } catch (err) {
      ctx.body = err;
    }
  }
  
};
