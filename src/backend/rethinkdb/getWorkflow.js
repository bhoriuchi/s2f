export default function createWorkflow (r, connection) {
  return function (source, args, context, info) {
    let { filterTemporalWorkflow } = this.globals._temporal
    return filterTemporalWorkflow(args).run(connection).then((res) => {
      console.log(res)
      return true
    })
  }
}