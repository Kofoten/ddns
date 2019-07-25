'use strict'

const Lookup = require('./src/lookup')
const gandi = require('./src/gandi')
const errorhandler = require('./src/errorhandler')

const apiKey = process.env.API_KEY || ''
const ttl = process.env.TTL || 1800
const names = process.env.NAMES ? process.env.NAMES.split(' ') : []
const types = process.env.TYPES ? process.env.TYPES.split(' ') : []

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
                const time = new Date()
                console.log(`${time.toISOString()}: INFO: ${domain}: ${message}`)
              })
              .catch(errorhandler)
          })
          .catch(err => {
            if (err.response && err.response.status === 404) {
              gandi
                .addRecordForDomain(domain, record, apiKey)
                .then(message => {
                  const time = new Date()
                  console.log(`${time.toISOString()}: INFO: ${domain}: ${message}`)
                })
                .catch(errorhandler)
            } else {
              throw err
            }
          })
          .catch(errorhandler)
      })
    })
    .catch(errorhandler)
}

const lookup = new Lookup(1000)

lookup.on('error', errorhandler)

lookup.on('ip', ip => {
  names.forEach(name => {
    types.forEach(type => {
      setRecords({ name, type, ttl, values: [ip] })
    })
  })
})
