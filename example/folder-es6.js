import _ from 'lodash'
import backend from './backend'
let lib = backend.lib

lib.S2FWorkflow(`{
  readRootFolder (type: TASK) {
    id,
    name,
    type,
    subFolders { id, name, type },
    entities { id, name, description, branchId, version }
  }
}`)
.then((res) => {
  console.log(JSON.stringify(res, null, '  '))
  process.exit()
})
.catch((err) => {
  console.error(err)
  process.exit()
})