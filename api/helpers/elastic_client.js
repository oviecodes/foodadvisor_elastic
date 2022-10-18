const { Client } = require('@elastic/elasticsearch')
const host = process.env.ELASTIC_HOST

const fs = require('fs')

const connector = () => {

  return new Client({
    node: host,
    auth: {
      username: process.env.ELASTIC_USERNAME,
      password: process.env.ELASTIC_PASSWORD
    },
    tls: {
      ca: fs.readFileSync('./http_ca.crt'),
      rejectUnauthorized: false
    }
  })

}

const testConn = (client) => {
  client.info()
    .then(response => console.log(response))
    .catch(error => console.error(error))
}

module.exports = {
  connector,
  testConn
}