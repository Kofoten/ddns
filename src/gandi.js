'use strict'

const axios = require('axios')

const makeUrl = endpoint => {
  return `https://dns.api.gandi.net/api/v5/${endpoint}`
}

const makeHead = apiKey => {
  return {
    'X-Api-Key': apiKey
  }
}

/**
 * Gets a list of domain names
 * @param {string} apiKey API key received at Gandi
 */
const getDomains = apiKey => {
  return axios({
    method: 'GET',
    url: makeUrl(`domains`),
    headers: makeHead(apiKey)
  }).then(resp => {
    return resp.data.map(x => x.fqdn)
  })
}

/**
 * Gets records for a domain
 * @param {string} domain Domain to get records for
 * @param {string} name Name of records to get
 * @param {string} apiKey API key received at Gandi
 */
const getRecordsForDomainByName = (domain, name, apiKey) => {
  return axios({
    method: 'GET',
    url: makeUrl(`domains/${domain}/records/${name}`),
    headers: makeHead(apiKey)
  }).then(resp => {
    return resp.data.map(x => ({
      type: x.rrset_type,
      ttl: x.rrset_ttl,
      name: x.rrset_name,
      href: x.rrset_href,
      values: x.rrset_values
    }))
  })
}

/**
 * Gets a record for a domain
 * @param {string} domain Domain to get record for
 * @param {string} name Name of record to get
 * @param {string} type Type of record to get
 * @param {string} apiKey API key received at Gandi
 */
const getRecordForDomainByNameAndType = (domain, name, type, apiKey) => {
  return axios({
    method: 'GET',
    url: makeUrl(`domains/${domain}/records/${name}/${type}`),
    headers: makeHead(apiKey)
  }).then(resp => {
    return {
      type: resp.data.rrset_type,
      ttl: resp.data.rrset_ttl,
      name: resp.data.rrset_name,
      href: resp.data.rrset_href,
      values: resp.data.rrset_values
    }
  })
}

/**
 * Adds a record for a domain
 * @param {string} domain Domain to add record to
 * @param {Object} record An object containing the requested record
 * @param {string} apiKey API key received at Gandi
 */
const addRecordForDomain = (domain, record, apiKey) => {
  return axios({
    method: 'POST',
    url: makeUrl(`domains/${domain}/records`),
    headers: makeHead(apiKey),
    data: {
      rrset_name: record.name,
      rrset_type: record.type,
      rrset_ttl: record.ttl,
      rrset_values: record.values
    }
  }).then(resp => {
    return resp.data.message
  })
}

/**
 * Updates a record for a domain
 * @param {string} domain Domain to update record for
 * @param {Object} record An object containing the requested record
 * @param {string} apiKey API key received at Gandi
 */
const updateRecordForDomaoin = (domain, record, apiKey) => {
  return axios({
    method: 'PUT',
    url: makeUrl(`domains/${domain}/records/${record.name}/${record.type}`),
    headers: makeHead(apiKey),
    data: {
      rrset_ttl: record.ttl,
      rrset_values: record.values
    }
  }).then(resp => {
    return resp.data.message
  })
}

module.exports = {
  getDomains,
  getRecordsForDomainByName,
  getRecordForDomainByNameAndType,
  addRecordForDomain,
  updateRecordForDomaoin
}
