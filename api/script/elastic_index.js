const strapi_url = 'http://localhost:1337/'
const axios = require('axios')
require('array.prototype.flatmap').shim()

const { connector, testConn } = require('../helpers/elastic_client')

const client = connector()
testConn(client)

const run = async () => {

  const response = await axios.get(`${strapi_url}api/search/restaurants`)

  const dataset = response.data

  await client.indices.create({
    index: 'foodadvisor-restaurant',
    operations: {
      mappings: {
        properties: {
          id: { type: 'integer' },
          name: { type: 'text' },
          slug: { type: 'keyword' },
          location: { type: 'text' },
          description: { type: 'text' },
          url: { type: 'text' }
        }
      }
    }
  }, { ignore: [400] })


  console.log(dataset)

  const operations = dataset.flatMap(doc => [{ index: { _index: 'foodadvisor-restaurant' } }, doc])

  // console.log(operations)

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
    // console.log(erroredDocuments)
  }

  const count = await client.count({ index: 'foodadvisor-restaurant' })

  console.log(count)

}

run().catch(console.log)

// async function read() {

//   const searchTerm = 'la'

//   const body = await client.search({
//     index: 'foodadvisor-restaurant',
//     body: {
//       query: {
//         regexp: { 
//           name: {
//             value: `${searchTerm}.*`,
//             flags: "ALL",
//             case_insensitive: true,
//           },
//         }
//       }
//     }
//   })
// }

// read().catch(console.log)

