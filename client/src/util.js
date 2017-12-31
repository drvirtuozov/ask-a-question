export async function postapi(method = '', body = {}) {
  const res = await fetch(`/api/${method}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (res.status !== 200) {
    throw await res.json();
  }

  return res.json();
}

export default {
  postapi,
};
