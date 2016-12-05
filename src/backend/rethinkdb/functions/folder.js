import _ from 'lodash'

export function createFolder (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let folder = backend.getTypeCollection('Folder')
  }
}

export function readFolder (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let folder = backend.getTypeCollection('Folder')
  }
}

export function updateFolder (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let folder = backend.getTypeCollection('Folder')
  }
}

export function deleteFolder (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let folder = backend.getTypeCollection('Folder')
  }
}

export function readWorkflowFolder (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let membership = backend.getTypeCollection('FolderMembership')
    return membership.get(source.id).run(connection)
  }
}

export function readRootFolder (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let folder = backend.getTypeCollection('Folder')
    let member = backend.getTypeCollection('FolderMembership')
    let task = backend.getTypeCollection('Task')
    let workflow = backend.getTypeCollection('Workflow')

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

export function readSubFolder (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let folder = backend.getTypeCollection('Folder')
    let member = backend.getTypeCollection('FolderMembership')
    let task = backend.getTypeCollection('Task')
    let workflow = backend.getTypeCollection('Workflow')

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