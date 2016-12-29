import _ from 'lodash'

export function createFolder (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let folder = backend.getCollection('Folder')
  }
}

export function readFolder (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let folder = backend.getCollection('Folder')
  }
}

export function updateFolder (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let folder = backend.getCollection('Folder')
  }
}

export function deleteFolder (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let folder = backend.getCollection('Folder')
  }
}

export function readWorkflowFolder (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let folder = backend.getCollection('Folder')
    let membership = backend.getCollection('FolderMembership')
    return membership.get(source._temporal.recordId)
      .do((m) => {
        return m.eq(null).branch(
          folder.filter({ type: 'WORKFLOW', parent: 'ROOT' }).nth(0)('id'),
          m('folder')
        )
      })
      .run(connection)
  }
}

export function readRootFolder (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let folder = backend.getCollection('Folder')
    let member = backend.getCollection('FolderMembership')
    let task = backend.getCollection('Task')
    let workflow = backend.getCollection('Workflow')

    return folder.filter((f) => f('type').eq(args.type).and(f('parent').eq('ROOT')))
      .merge((p) => {
        return {
          subFolders: folder.filter({ parent: p('id') }).coerceTo('array'),
          entities: member.filter({ folder: p('id') })
            .map((m) => {
              return r.expr(_.toLower(args.type))
                .eq('task')
                .branch(task, workflow)
                .filter({ _temporal: { recordId: m('childId') } })
                .reduce((prev, curr) => {
                  return r.branch(
                    prev('_temporal')('validFrom').eq(null)
                      .and(curr('_temporal')('validFrom').ne(null)),
                    curr,
                    prev('_temporal')('validTo').ne(null)
                      .and(curr('_temporal')('validFrom').ne(null))
                      .and(curr('_temporal')('validTo').eq(null)),
                    curr,
                    prev
                  )
                })
                .default(null)
                .do((e) => {
                  return e.eq(null).branch(
                    null,
                    r.expr({
                      id: e('_temporal')('recordId'),
                      branchId: e('id'),
                      version: e('_temporal')('version'),
                      name: e('name')
                    })
                  )
                })
            })
            .filter((r) => r.eq(null).not())
            .coerceTo('array')
        }
      })
      .coerceTo('array')
      .do((res) => res.count().eq(0).branch(null, res.nth(0)))
      .run(connection)
  }
}

export function readSubFolder (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let folder = backend.getCollection('Folder')
    let member = backend.getCollection('FolderMembership')
    let task = backend.getCollection('Task')
    let workflow = backend.getCollection('Workflow')

    return folder.filter({ id: args.id })
      .merge((p) => {
        return {
          subFolders: folder.filter({ parent: p('id') }).coerceTo('array'),
          entities: member.filter({ folder: p('id') })
            .map((m) => {
              return p('type')
                .eq('TASK')
                .branch(task, workflow)
                .filter({ _temporal: { recordId: m('childId') } })
                .coerceTo('array')
                .do((e) => {
                  return e.count().eq(0)
                    .branch(
                      null,
                      e.nth(0).do((i) => {
                        return {
                          id: i('_temporal')('recordId'),
                          branchId: i('id'),
                          version: i('_temporal')('version'),
                          name: i('name')
                        }
                      })
                    )
                })
            })
            .filter((r) => r.eq(null).not())
            .coerceTo('array')
        }
      })
      .coerceTo('array')
      .do((res) => res.count().eq(0).branch(null, res.nth(0)))
      .run(connection)
  }
}

export default {
  readWorkflowFolder,
  createFolder,
  readFolder,
  updateFolder,
  deleteFolder,
  readRootFolder,
  readSubFolder
}