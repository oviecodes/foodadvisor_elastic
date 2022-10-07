'use strict';

/**
 * search service
 */

module.exports = ({ }) => ({
    restaurants: async() => {
        
        const data = await strapi.entityService.findMany('api::restaurant.restaurant', {
            fields: ['id', 'slug', 'name']
        })
        // console.log('all restaurants', data)
        return data
    }
});
