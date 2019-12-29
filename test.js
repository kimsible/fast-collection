'use strict'

import test from 'ava'
import DbCollection from '.'

const data = [
  { name: 'marvin', body: 'lorem ipsum', date: 10000 },
  { name: 'toto', body: 'lorem ipsum', date: 27000, active: true }
]

test('retrieve-string', retrieve, [{ body: 'lorem ipsum' }], DbCollection.from(data))
test('retrieve-regexp', retrieve, [{ name: /^marvi/ }], DbCollection.of(data[0]))
test('retrieve-boolean', retrieve, [{ active: true }], DbCollection.of(data[1]))
test('retrieve-function', retrieve, [{ date: date => date < 20000 }], DbCollection.of(data[0]))
test('retrieve-multiple', retrieve, [{ name: /^marvi/ }, { name: 'toto' }], DbCollection.from(data))
test('select', select, ['date', 'body'], DbCollection.from([{ body: 'lorem ipsum', date: 10000 }, { body: 'lorem ipsum', date: 27000 }]))
test('update', update, { name: 'toto' }, { body: 'lorem ipsum' })
test('delete', del, { name: 'toto' })
test('values', values, 'name', ['marvin', 'toto'])
test('findIndex-found', findIndex, { name: 'toto' }, 1)
test('findIndex-notfound', findIndex, { name: 'titi' }, -1)
test('retrieveOne-found', retrieveOne, { name: 'toto' }, DbCollection.of(data[1]))
test('retrieveOne-notfound', retrieveOne, { name: 'titi' }, DbCollection.from([]))

function retrieve (t, input, expected) {
  t.deepEqual(DbCollection.from(data).retrieve(...input), expected)
}

function select (t, input, expected) {
  t.deepEqual(DbCollection.of(...data).select(...input), expected)
}

function update (t, filters, item) {
  const ref = new DbCollection(...data)
  const updated = { ...ref.retrieve(filters)[0], ...item }
  t.deepEqual(ref.update(filters, item), updated)
}

function del (t, filters) {
  const ref = new DbCollection(...data)
  const deleted = ref.retrieve(filters)[0]
  const length = ref.length - 1
  t.deepEqual(ref.delete(filters), deleted)
  t.deepEqual(ref.length, length)
}

function values (t, input, expected) {
  const ref = new DbCollection(...data)
  t.deepEqual(ref.values(input), expected)
}

function findIndex (t, input, expected) {
  const ref = new DbCollection(...data)
  t.deepEqual(ref.findIndex(item => item.name === input.name), expected)
}

function retrieveOne (t, input, expected) {
  const ref = new DbCollection(...data)
  t.deepEqual(ref.retrieveOne(input), expected)
}
