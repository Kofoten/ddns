'use strict'

const Lookup = require('./src/lookup')
const gandi = require('./src/gandi')

const apiKey = process.env.API_KEY || ''
const ttl = process.env.TTL || 1800
const names = process.env.NAMES ? process.env.NAMES.split(' ') : []
const types = process.env.TYPES ? process.env.TYPES.split(' ') : []

const handleError = error => {
  if (error.response) {
    console.log(
      `${error.response.data.code}: ${error.response.data.cause}: ${
        error.response.data.message
      }`
    )
  } else {
    throw error
  }
}

const setRecords = record => {
  gandi
    .getDomains(apiKey)
    .then(domains => {
      domains.forEach(domain => {
        gandi
          .getRecordForDomainByNameAndType(
            domain,
            record.name,
            record.type,
            apiKey
          )
          .then(() => {
            gandi
              .updateRecordForDomaoin(domain, record, apiKey)
              .then(message => {
                console.log(`${domain}: ${message}`)
              })
              .catch(handleError)
          })
          .catch(err => {
            if (err.response && err.response.status === 404) {
              gandi
                .addRecordForDomain(domain, record, apiKey)
                .then(message => {
                  console.log(`${domain}: ${message}`)
                })
                .catch(handleError)
            } else {
              throw err
            }
          })
          .catch(handleError)
      })
    })
    .catch(handleError)
}

const lookup = new Lookup(1000)

lookup.on('error', err => {
  console.error(err)
})

lookup.on('ip', ip => {
  names.forEach(name => {
    types.forEach(type => {
      setRecords({ name, type, ttl, values: [ip] })
    })
  })
})
