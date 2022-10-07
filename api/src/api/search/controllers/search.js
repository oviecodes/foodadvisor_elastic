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

  search: async(ctx, next) => {

  }
  
};
