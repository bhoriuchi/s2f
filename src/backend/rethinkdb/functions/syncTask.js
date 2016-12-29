import _ from 'lodash'
import EntityTypeEnum from '../../../graphql/types/EntityTypeEnum'
import ParameterScopeEnum from '../../../graphql/types/ParameterScopeEnum'
import FolderChildTypeEnum from '../../../graphql/types/FolderChildTypeEnum'
const UPDATE = 'update'
const INSERT = 'insert'

let { values: { PARAMETER, TASK } } = EntityTypeEnum
let FolderType = FolderChildTypeEnum.values

export function isNewId (id) {
  return id.match(/^new:/) !== null
}

export function mapIds (args, r, task, id = '') {
  let ids = {
    recordId: task.get(id).eq(null).branch(
      r.uuid(),
      task.get(id)('_temporal')('recordId')
    )
  }

  // task id
  ids[args.id] = isNewId(args.id) ? { op: INSERT, id: r.uuid() } : { op: UPDATE, id: args.id }

  // task parameters
  _.forEach(args.parameters, (param) => {
    ids[param.id] = isNewId(param.id) ? { op: INSERT, id: r.uuid() } : { op: UPDATE, id: param.id }
  })

  return ids
}

export function getOp (ids, uuid, prefix) {
  let { op, id } = _.get(ids, uuid, {})
  return {
    [`${prefix}Id`]: id,
    [`${prefix}Op`]: op
  }
}

export default function syncTask (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let task = backend.getCollection('Task')
    let parameter = backend.getCollection('Parameter')
    let folder = backend.getCollection('Folder')
    let membership = backend.getCollection('FolderMembership')
    let owner = args.owner || null

    let makeTemporal = (obj, recordId) => {
      return _.merge(obj, {
        _temporal: {
          recordId,
          name: 'initial',
          validFrom: null,
          validTo: null,
          version: null,
          owner,
          changeLog: [
            {
              type: 'CREATE',
              user: owner,
              message: 'created workflow'
            }
          ]
        }
      })
    }

    return r.expr(mapIds(args, r, task, args.id))
      .run(connection)
      .then((ids) => {
        let isNewTask = false
        let mutations = []
        let params = []
        let op = {
          [INSERT]: { task: {}, parameter: {} },
          [UPDATE]: { task: {}, parameter: {} }
        }

        // re-map workflow
        let { taskId, taskOp } = getOp(ids, args.id, 'task')
        let taskObj = { id: taskId, entityType: TASK }

        if (taskOp === INSERT) {
          isNewTask = true
          makeTemporal(taskObj, ids.recordId)
        }
        _.set(op, `["${taskOp}"].task["${taskId}"]`, _.merge(
          {},
          _.omit(args, ['parameters', 'steps', '_temporal.owner', '_temporal.name']), taskObj)
        )

        // re-map parameters
        _.forEach(args.parameters, (param) => {
          let { paramId, paramOp } = getOp(ids, param.id, 'param')
          params.push(paramId)
          _.set(op, `["${paramOp}"].parameter["${paramId}"]`, _.merge({}, param, {
            id: paramId,
            parentId: taskId,
            scope: ParameterScopeEnum.TASK,
            entityType: PARAMETER
          }))
        })

        // create a flattened array of actions
        _.forEach(op, (colls, opName) => {
          _.forEach(colls, (coll, collName) => {
            _.forEach(coll, (obj, objId) => {
              mutations.push({
                id: objId,
                op: opName,
                collection: collName,
                data: obj
              })
            })
          })
        })

        // process all mutations
        return r.expr(mutations).forEach((m) => {
          return m('op').eq(INSERT).branch(
            r.branch(
              m('collection').eq('task'),
              task.insert(m('data')),
              parameter.insert(m('data'))
            ),
            r.branch(
              m('collection').eq('task'),
              task.get(m('id')).update(m('data')),
              parameter.get(m('id')).update(m('data'))
            )
          )
        })
          // folder updates
          .do(() => {
            return folder.get(args.folder || '').ne(null).branch(
              r.expr(isNewTask).branch(
                membership.insert({
                  folder: args.folder,
                  childId: ids.recordId,
                  childType: FolderType.TASK
                }),
                membership.get(ids.recordId).update({ folder: args.folder })
              ),
              folder.filter({ type: FolderType.TASK, parent: FolderType.ROOT })
                .nth(0)
                .do((rootFolder) => {
                  return r.expr(isNewTask).branch(
                    membership.insert({
                      folder: rootFolder('id'),
                      childId: ids.recordId,
                      childType: FolderType.TASK
                    }),
                    membership.get(ids.recordId).update({ folder: rootFolder('id') })
                  )
                })
            )
          })
          // remove parameters that are no longer used
          .do(() => {
            return parameter.filter({ parentId: taskId })
              .filter((p) => r.expr(params).contains(p('id')).not())
              .delete()
          })
          .do(() => task.get(taskId))
          .run(connection)
      })
  }
}