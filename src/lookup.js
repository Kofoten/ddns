'use strict'

const EventEmitter = require('events')
const axios = require('axios')

const expectedErrors = ['EAI_AGAIN', 'ECONNRESET', 'ETIMEDOUT', 'ENETUNREACH']

class Lookup extends EventEmitter {
  constructor(interval) {
    super()

    this.current = ''
    this.url = 'https://api.ipify.org'
    this.interval = setInterval(() => {
      this._run()
    }, interval)
  }

  _run() {
    axios
      .get(this.url)
      .then(resp => {
        if (resp.data && resp.data != this.current) {
          this.current = resp.data
          this.emit('ip', resp.data)
        }
      })
      .catch(err => {
        if (!err.code || !expectedErrors.some(exp => exp === err.code)) {
          this.emit('error', err)
        }
      })
  }

  stop() {
    clearInterval(this.interval)
  }
}

module.exports = Lookup
