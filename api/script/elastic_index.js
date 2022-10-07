const { Client } = require('@elastic/elasticsearch')
const host = 'https://localhost:9200'
const strapi_url = 'http://localhost:1337/'
const axios = require('axios')
// const cert = require('../http_ca.crt')
const fs = require('fs')
require('array.prototype.flatmap').shim()
// const flatMap = require('flatmap')

const client = new Client({
    node: host,
    auth: {
      username: 'elastic',
      password: 'hybridtechnol123'
    },
    tls: {
      ca: fs.readFileSync('./http_ca.crt'),
      rejectUnauthorized: false
    }
})



client.info()
  .then(response => console.log(response))
  .catch(error => console.error(error))

const run = async () => {

  const response = await axios.get(`${strapi_url}api/search/restaurants`)

  const dataset = response.data

  // console.log(response)

  // http://localhost:1337/api/search/restaurants

  // // await Promise.all(indices.map((el) => {
  //   await client.index({
  //     index: 'foodadvisor-restaurant',
  //     body: {
  //       name: 'la bruja',
  //       slug: 'la-bruja'
  //     }
  //   })
  // }))

  await client.indices.create({
    index: 'foodadvisor-restaurant',
    operations: {
      mappings: {
        properties: {
          id: { type: 'integer' },
          name: { type: '' },
          slug: { type: 'keyword' },
        }
      }
    }
  }, { ignore: [400] })


  console.log(dataset)

  const operations = dataset.flatMap(doc => [{ index: { _index: 'foodadvisor-restaurant' } }, doc])

  console.log(operations)

  const bulkResponse = await client.bulk({ refresh: true, operations })

  if (bulkResponse.errors) {
    const erroredDocuments = []
    // The items array has the same order of the dataset we just indexed.
    // The presence of the `error` key indicates that the operation
    // that we did for the document has failed.
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0]
      if (action[operation].error) {
        erroredDocuments.push({
          // If the status is 429 it means that you can retry the document,
          // otherwise it's very likely a mapping error, and you should
          // fix the document before to try it again.
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[i * 2 + 1]
        })
      }
    })
    console.log(erroredDocuments)
  }

  const count = await client.count({ index: 'foodadvisor-restaurant' })

  console.log(count)

}


  // console.log(indices)
  // await client.indices.refresh({ index: 'foodadvisor-restaurant' })


// run().catch(console.log)



async function read() {

  const searchTerm = 'la'

  const body = await client.search({
    index: 'foodadvisor-restaurant',
    body: {
      query: {
        regexp: { 
          name: {
            value: `${searchTerm}.*`,
            flags: "ALL",
            case_insensitive: true,
          },
        }
      }
    }
  })
  console.log(body.hits.hits)
  // console.log(body)
}

read().catch(console.log)

