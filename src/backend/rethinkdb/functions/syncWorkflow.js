export default function syncWorkflow (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    // let parameter = backend.getTypeCollection('Parameter')
    console.log(args)
    return args
  }
}