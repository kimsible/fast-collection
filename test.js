'use strict'

import test from 'ava'
import SimpleArray from '.'

test('done', t => {
  const arrayTest = new SimpleArray()
  t.true(arrayTest instanceof SimpleArray)
})
