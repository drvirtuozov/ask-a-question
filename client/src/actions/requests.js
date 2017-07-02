import axios from 'axios';


export async function getGraph(query) {
  const res = await axios.post('/api', { query });

  if (res.data.data) {
    return res.data.data;
  }

  console.log(res.data.errors);
  throw new Error('GraphQL error');
}
