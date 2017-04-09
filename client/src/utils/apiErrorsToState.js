export default function (errors) {
  const output = {};

  for (const e of errors) {
    output[e.field] = e.detail;
  }

  return output;
}
