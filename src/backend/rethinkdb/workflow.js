export function cloneWorkflow (backend, id) {

}

export function create (backend) {
  let r = backend._r
  let connection = backend._connection

  return function (source, args, context, info) {
    let { createTemporalWorkflow, createTemporalStep } = this.globals._temporal

    return r.do(r.uuid(), r.uuid(), (startId, endId) => {
      return createTemporalStep([
        {
          id: startId,
          name: 'Start',
          description: 'Starting point of the workflow',
          type: 'START',
          timeout: 0,
          failsWorkflow: false,
          waitOnSuccess: false,
          requireResumeKey: false,
          success: endId,
          fail: endId,
          parameters: []
        },
        {
          id: endId,
          name: 'End',
          description: 'Ending point of the workflow',
          type: 'END',
          timeout: 0,
          failsWorkflow: false,
          waitOnSuccess: false,
          requireResumeKey: false,
          success: endId,
          fail: endId,
          parameters: []
        }
      ])
    })('changes').do((changes) => {
      let newArgs = r.expr(args).merge({ steps: changes('new_val')('id'), parameters: [] })
      return createTemporalWorkflow(newArgs)('changes')('new_val').merge({ steps: changes('new_val') })
    })
      .nth(0)
      .run(connection)
  }
}

export function read (backend) {
  let connection = backend._connection
  return function (source, args, context, info) {
    let { filterTemporalWorkflow } = this.globals._temporal
    return filterTemporalWorkflow(args).run(connection)
  }
}

export function update (backend) {
  return function (source, args, context, info) {

  }
}

export function del (backend) {
  return function (source, args, context, info) {

  }
}



export default {
  cloneWorkflow,
  create,
  read,
  update,
  del
}