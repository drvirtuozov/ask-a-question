export default async function(obj, GraphQLType) {
  let fields = GraphQLType.getFields(),
    output = {};

  for (let field in fields) {
    output[fields[field].name] = await fields[field].resolve(obj);
  }

  return output;
}