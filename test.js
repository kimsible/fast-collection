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
test('update', update, { body: 'lorem ipsum' }, { name: 'toto' })
test('remove', remove, [{ name: 'toto' }])
test('values', values, 'name', ['marvin', 'toto'])

function retrieve (t, input, expected) {
  t.deepEqual(DbCollection.from(data).retrieve(...input), expected)
}

function select (t, input, expected) {
  t.deepEqual(DbCollection.of(...data).select(...input), expected)
}

function update (t, item, where) {
  const ref = new DbCollection(...data)
  const updated = { ...ref.retrieve(where)[0], ...item }
  t.deepEqual(ref.update(item)(where), updated)
}

function remove (t, where) {
  const ref = new DbCollection(...data)
  const deleted = ref.retrieve(...where)[0]
  const length = ref.length - 1
  t.deepEqual(ref.delete(...where), deleted)
  t.deepEqual(ref.length, length)
}

function values (t, input, expected) {
  const ref = new DbCollection(...data)
  t.deepEqual(ref.values(input), expected)
}
