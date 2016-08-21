import _ from 'lodash'
import * as graphql from 'graphql'
import GraphQLFactory from 'graphql-factory'
let factory = GraphQLFactory(graphql)

let store = {
  List: [
    { id: 'list1', name: 'list1', items: ['item1'] }
  ],
  Item: [
    { id: 'item1', name: 'item1' }
  ]
}

function getRecords (type, args) {
  if (args.id) {
    let res = _.find(store[type], { id: args.id })
    return res ? [res] : []
  }
  return store[type]
}

let functions = {
  getLists (source, args, context, info) {
    return getRecords('List', args)
  },
  getItems (source, args, context, info) {
    return getRecords('Item', args)
  },
  getListItems (source, args, context, info) {
    return _.map(source.items, (id) => {
      return _.find(store.Item, { id })
    })
  },
}

let types = {
  List: {
    fields: {
      id: 'String',
      name: 'String',
      items: {
        type: ['Item'],
        resolve: 'getListItems'
      }
    }
  },
  Item: {
    fields: {
      id: 'String',
      name: 'String',
      description: 'String'
    }
  },
  ListQuery: {
    fields: {
      getLists: {
        type: ['List'],
        args: {
          id: 'String'
        },
        resolve: 'getLists'
      },
      getItems: {
        type: ['Item'],
        args: {
          id: 'String'
        },
        resolve: 'getItems'
      }
    }
  }
}

let schemas = {
  List: {
    query: 'ListQuery'
  }
}

let lib = factory.make({
  functions,
  types,
  schemas
})

// console.log(JSON.stringify(lib._definitions.definition, null, '  '))

lib.List('{ getLists(id: "list1") { id, name, items { id, name, description } } }')
  .then((res) => {
    console.log('ok', JSON.stringify(res, null, '  '))
  })
  .catch((err) => {
    console.error('err', err)
  })