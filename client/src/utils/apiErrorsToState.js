export default function(errors) {
  let output = {};
  
  for (let e of errors) {
    output[e.field] = e.detail;
  }
  
  return output;
}