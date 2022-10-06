const { Client } = require('@elastic/elasticsearch')
const host = 'https://localhost:9200'
const strapi_url = 'http://localhost:1337/'
const axios = require('axios')
// const cert = require('../http_ca.crt')
const fs = require('fs')

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

    const response = await axios.get(`${strapi_url}api/restaurants`)

    const indices = response.data.data

    // console.log(indices)
}

run()