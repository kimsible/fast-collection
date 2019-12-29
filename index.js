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

class Collection extends Array {
  retrieve (...where) {
    return this.reduce((acc, item) => {
      if (hasOneMatch(item, where)) {
        acc.push(item)
      }
      return acc
    }, Collection.from([]))
  }

  retrieveIndex (filters) {
    let index = 0
    while (index < this.length) {
      if (isDeepMatch(this[index], filters)) {
        return index
      }
      index++
    }
    return -1
  }

  retrieveOne (filters) {
    const index = this.retrieveIndex(filters)
    if (index > -1) {
      return Collection.of(this[index])
    }
    return Collection.from([])
  }

  select (...keys) {
    return this.map(item => keys.reduce((acc, key) => {
      acc[key] = item[key]
      return acc
    }, {}))
  }

  valuesOf (key) {
    return this.reduce((acc, item) => {
      if (acc.indexOf(item[key]) < 0) {
        acc.push(item[key])
      }
      return acc
    }, [])
  }
}

module.exports = Collection
