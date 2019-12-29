'use strict'

const isMatchWith = require('lodash.ismatchwith')

const compare = (source, filter) => {
  if (typeof filter === 'function') {
    return filter(source)
  }
  if (['boolean', 'number', 'string'].includes(typeof filter)) {
    return filter === source
  }
  if (filter instanceof RegExp) {
    return filter.test(source)
  }
}

const isMatchMultiple = (source, filters) => filters.find(filter => isMatchWith(source, filter, compare))

class DbCollection extends Array {
  retrieve (...where) {
    return DbCollection.from(this.reduce((acc, item) => {
      const matched = isMatchMultiple(item, where)
      if (matched) {
        return [...acc, item]
      } else {
        return acc
      }
    }, []))
  }

  select (...keys) {
    return this.map(item => keys.reduce((acc, key) => ({ ...acc, [key]: item[key] }), {}))
  }

  update (item) {
    return (...where) => {
      const index = this.findIndex(item => isMatchMultiple(item, where))
      if (index > -1) {
        const updated = { ...this[index], ...item }
        this.splice(index, 0, updated)
        return updated
      }
    }
  }

  delete (...where) {
    const index = this.findIndex(item => isMatchMultiple(item, where))
    if (index > -1) {
      const deleted = this[index]
      this.splice(index, 1)
      return deleted
    }
  }

  values (key) {
    return this.reduce((acc, item) => {
      if (acc.indexOf(item[key]) < 0) {
        acc.push(item[key])
      }
      return acc
    }, [])
  }
}

module.exports = DbCollection
