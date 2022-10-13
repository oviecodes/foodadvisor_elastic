'use strict';

const { connector, testConn } = require('../../../../helpers/elastic_client')

const client = connector()

/**
 * search service
 */

module.exports = ({ strapi }) => ({
    
    restaurants: async () => {

        const data = await strapi.entityService.findMany('api::restaurant.restaurant', {
            populate: { information: true, place: true, images: true }
        })

        const mappedData = data.map((el, i) => {
            return { id: el.id, slug: el.slug, name: el.name, description: el.information.description, location: el.place.name, image: el.images[0].url }
        })

        return mappedData
    },

    articles: async() => {

        const data = await strapi.entityService.findMany('api::article.article', {
            populate: { seo: true, category: true, image: true }
        })

        const mappedData = data.map((el, i) => {

            return { id: el.id, slug: el.slug, title: el.title, metaTitle: el.seo.metaTitle, metaDescription: el.seo.metaDescription, url: el.image.url, category: el.category.name }
        })
        return mappedData
    },

    search_restaurants: async (data) => {

        //test client's connection to elastic search
        testConn(client)

        async function read() {

            const search = data.s
            const field = data.field || 'name'

            console.log(field)

            const body = await client.search({
                index: 'foodadvisor-restaurant',
                body: {
                    query: {
                        regexp: {
                            [field]: {
                                value: `${search}.*`,
                                flags: "ALL",
                                case_insensitive: true,
                            },
                        }
                    }
                }
            })

            const mappedData = body.hits.hits

            await Promise.all(mappedData.map(async(el, i) => {
                mappedData[i] = await strapi.entityService.findOne('api::restaurant.restaurant', el._source.id, {
                    populate: { information: true, place: true, images: true, category: true }
                })
            }))
    
            mappedData.map((el, i) => {
                const images = el.images
                const place = el.place
                const category = el.category
                delete el.images
                delete el.place
                delete el.category
                const imageData = []
                
                images.forEach(el => {
                    imageData.push({ id: el.id, attributes: el })
                })
                el.images = {
                    data: imageData
                }
                el.place = {
                    data: {
                        attributes: place
                    }
                }
                el.category = {
                    data: {
                        attributes: category
                    }
                }
            })

            return mappedData
        }

        return read().catch(console.log)

    },

    populate_restaurants: async(data) => {
        console.log('data')
        await Promise.all(data.map(async(el, i) => {
            data[i] = await strapi.entityService.findOne('api::restaurant.restaurant', el.id, {
                populate: { information: true, place: true, images: true, category: true }
            })
        }))

        data.map((el, i) => {
            const images = el.images
            const place = el.place
            const category = el.category
            delete el.images
            delete el.place
            delete el.category
            const imageData = []
            images.forEach(el => {
                imageData.push({ id: el.id, attributes: el })
            })
            el.images = {
                data: imageData
            }
            el.place = {
                data: {
                    attributes: place
                }
            }
            el.category = {
                data: {
                    attributes: category
                }
            }
        })
    }
});
