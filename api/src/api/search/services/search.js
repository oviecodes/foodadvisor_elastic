'use strict';

const { connector, testConn } = require('../../../../helpers/elastic_client')

const client = connector()

/**
 * search service
 */

module.exports = ({ }) => ({
    restaurants: async () => {

        const data = await strapi.entityService.findMany('api::restaurant.restaurant', {
            fields: ['id', 'slug', 'name']
        })
        // console.log('all restaurants', data)
        return data
    },

    search_restaurants: async (data) => {

        //test client's connection to elastic search
        testConn(client)

        async function read() {

            const search = data.s

            const body = await client.search({
                index: 'foodadvisor-restaurant',
                body: {
                    query: {
                        regexp: {
                            name: {
                                value: `${search}.*`,
                                flags: "ALL",
                                case_insensitive: true,
                            },
                        }
                    }
                }
            })

            return body.hits.hits
        }

        return read().catch(console.log)

    }
});
