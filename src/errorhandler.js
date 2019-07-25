'use strict'

const handler = error => {
  const prefix = `${new Date().toISOString()}: ERR:`

  if (error.response) {
    console.log(
      `${prefix} ${error.response.data.code}: ${error.response.data.cause}: ${
        error.response.data.message
      }`
    )
  } else {
    throw error
  }
}

module.exports = handler
