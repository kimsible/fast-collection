# fast-collection

Small library making javascript object-array manipulation fast, easy, and giving some useful tools for an in-memory database based on javascript collections.
- - -
### Getting start

This library extends `Array` javascript global object, so every methods and properties of `Array` can be used.

##### Examples
```javascript
const Collection = require('fast-collection')

const arrayObject = [
  { id: 'VGmMSEdRE08', name: 'Jyn Erso', species: 'Human', jedi: false },
  { id: '7Mw8rRmQBPJ', name: 'D-O', species: 'Droid', jedi: false },
  { id: 'igZy1rU2_ap', name: 'Aayla Secura', species: 'Twi’lek', jedi: true },
  { id: 'Enh1bod3qHZ', name: 'Ahsoka Tano', species: 'Togruta', jedi: true },
  { id: '7wllhuMz9tr', name: 'Yoda', species: 'Unkown', jedi: true }
]

const collection = Collection.from(arrayObject)
```
_Retrieve all being `jedi` AND `Togruta` and select only `id`, `name` properties_


```javascript

collection.retrieve({ jedi: true, species: 'Togruta' }).select('id', 'name')
// return [{ id: 'Enh1bod3qHZ', name: 'Ahsoka Tano' }]
```

_Retrieve all not being `jedi` OR `Unknown` species and select only `name` property_

```javascript
collection.retrieve({ jedi: false }, { species: 'Unknown' }).select('name')
// return [{ name: 'Jyn Erso' }, { name: 'D-O' }, { name: 'Yoda'}]
```

_Retrieve first being with the lastname `Tano` and select only `name` property_

```javascript
collection.retrieveOne({ name: /Tano$/ }).select('name')
// return [{ name: 'Ahsoka Tano' }]
```

_Retrieve index with `id` property_

```javascript
collection.retrieveIndex({ id: '7Mw8rRmQBPJ' })
// return 1
```
_Retrieve values of a string, number or boolean property_

```javascript
collection.valuesOf('species')
// return ['Human', 'Droid', 'Togruta', 'Twi’lek', 'Unknown']

collection.valuesOf('jedi')
// return [false, true]
```

_**Limit** retrieved items with `slice`_

```javascript
// limit 2 items from the first item found
collection.retrieve({ jedi: true }).select('name').slice(0, 2)
// return [{ name: 'Aayla Secura' }, { name: 'Ahsoka Tano' }]
```



_**Insert** with `ES spread operator` or `splice`_

```javascript
// fastest
[
  {
    id: 'oE6iC-2AW9T_2t5yQz2eS',
    name: 'Rey Skywalker',
    species: 'Human',
    jedi: true
  },
  ...collection
]

// slower
collection.splice(0, 0, {
  id: 'oE6iC-2AW9T_2t5yQz2eS',
  name: 'Rey Skywalker',
  species: 'Human',
  jedi: true
})
```

_**Update** and **Delete** with retrieveIndex and splice_

```javascript
// update - delete and replace
const index = collection.retrieveIndex({ id: '7Mw8rRmQBPJ' })
collection.splice(index, 1, {...collection[index], { name: 'R2D2' }})

// delete
const index = collection.retrieveIndex({ id: '7wllhuMz9tr' })
collection.splice(index, 1)
```
- - -
### API

#### Collection.prototype.retrieve()

##### Syntax
> col.retrieve(_filter0_[, _filter1_[, ...[, _filterN_]]])

##### Parameters
**`filterN`**
`Object` containing properties filter, type of property values can be `string`, `boolean`, `number`, `function` or `Regexp`.

##### Return value
Reduced `Collection` instance.

#### Collection.prototype.retrieveOne()

##### Syntax
> col.retrieveOne(_filter_)

##### Parameters
**`filter`**
`Object` containing properties filter, type of property values can be `string`, `boolean`, `number`, `function` or `Regexp`.

##### Return value
New `Collection` instance with the first object found.

#### Collection.prototype.retrieveIndex()

##### Syntax
> col.retrieveIndex(_filter_)

##### Parameters
**`filter`**
`Object` containing properties filter, type of property values can be `string`, `boolean`, `number`, `function` or `Regexp`.

##### Return value
Index `number` found of the `Collection` instance.

#### Collection.prototype.valuesOf()

##### Syntax
> col.valuesOf(_property_)

##### Parameters
**`property`**
Property name of `Collection` instance items. Type of property values can only be `boolean`, `string`, or `number`.

##### Return value
`Array` instance with the list of values found.

#### Collection.prototype.select()

##### Syntax
> col.select(_property0_[, _property1_[, ...[, _propertyN_]]])

##### Parameters
**`propertyN`**
Property name of `Collection` instance items.

##### Return value
Cloned `Collection` instance with the selected properties.
