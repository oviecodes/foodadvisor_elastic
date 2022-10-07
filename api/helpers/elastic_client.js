const { Client } = require('@elastic/elasticsearch')
const host = 'https://localhost:9200'

const fs = require('fs')

const connector = () => {

    return new Client({
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