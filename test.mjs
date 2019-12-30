'use strict'

import test from 'ava'
import Collection from '.'

const data = [
  { name: 'marvin', body: 'lorem ipsum', date: 10000 },
  { name: 'toto', body: 'lorem ipsum', date: 27000, active: true }
]

test('retrieve-string', retrieve, [{ body: 'lorem ipsum' }], Collection.from(data))
test('retrieve-regexp', retrieve, [{ name: /^marvi/ }], Collection.of(data[0]))
test('retrieve-boolean', retrieve, [{ active: true }], Collection.of(data[1]))
test('retrieve-function', retrieve, [{ date: date => date < 20000 }], Collection.of(data[0]))
test('retrieve-multiple', retrieve, [{ name: /^marvi/ }, { name: 'toto' }], Collection.from(data))
test('select', select, ['date', 'body'], Collection.from([{ body: 'lorem ipsum', date: 10000 }, { body: 'lorem ipsum', date: 27000 }]))
test('values', valuesOf, 'name', ['marvin', 'toto'])
test('retrieveIndex-found', retrieveIndex, { name: 'toto' }, 1)
test('retrieveIndex-notfound', retrieveIndex, { name: 'titi' }, -1)
test('retrieveOne-found', retrieveOne, { name: 'toto' }, Collection.of(data[1]))
test('retrieveOne-notfound', retrieveOne, { name: 'titi' }, Collection.from([]))

function retrieve (t, input, expected) {
  t.deepEqual(Collection.from(data).retrieve(...input), expected)
}

function select (t, input, expected) {
  t.deepEqual(Collection.of(...data).select(...input), expected)
}

function valuesOf (t, input, expected) {
  const ref = new Collection(...data)
  t.deepEqual(ref.valuesOf(input), expected)
}

function retrieveIndex (t, input, expected) {
  const ref = new Collection(...data)
  t.deepEqual(ref.retrieveIndex(input), expected)
}

function retrieveOne (t, input, expected) {
  const ref = new Collection(...data)
  t.deepEqual(ref.retrieveOne(input), expected)
}
