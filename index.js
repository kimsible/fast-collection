'use strict'

const compare = (value, filter) => {
  if (typeof filter === 'function') {
    return filter(value)
  }
  if (['boolean', 'number', 'string'].includes(typeof filter)) {
    return filter === value
  }
  if (filter instanceof RegExp) {
    return filter.test(value)
  }
}

const isDeepMatch = (item, filters) => {
  for (const key in filters) {
    if (!compare(item[key], filters[key])) {
      return false
    }
  }
  return true
}

const hasOneMatch = (item, where) => {
  for (const filters of where) {
    if (isDeepMatch(item, filters)) {
      return true
    }
  }
  return false
}

class DbCollection extends Array {
  retrieve (...where) {
    return this.reduce((acc, item) => {
      if (hasOneMatch(item, where)) {
        acc.push(item)
      }
      return acc
    }, DbCollection.from([]))
  }

  retrieveOne (filters) {
    const index = this.findIndex(item => isDeepMatch(item, filters))
    if (index > -1) {
      return DbCollection.of(this[index])
    }
    return DbCollection.from([])
  }

  select (...keys) {
    return this.map(item => keys.reduce((acc, key) => {
      acc[key] = item[key]
      return acc
    }, {}))
  }

  update (filters, update) {
    const index = this.findIndex(item => isDeepMatch(item, filters))
    if (index > -1) {
      const updated = { ...this[index], ...update }
      this.splice(index, 0, updated)
      return updated
    }
  }

  delete (filters) {
    const index = this.findIndex(item => isDeepMatch(item, filters))
    if (index > -1) {
      return this.splice(index, 1)[0]
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

  findIndex (callback) {
    let index = 0
    while (index < this.length) {
      if (callback(this[index])) {
        return index
      }
      index++
    }
    return -1
  }
}

module.exports = DbCollection
