'use strict'

const EventEmitter = require('events')
const axios = require('axios')

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
        this.emit('error', err)
      })
  }

  stop() {
    clearInterval(this.interval)
  }
}

module.exports = Lookup
