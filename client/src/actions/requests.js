import axios from 'axios';


export async function grapqlQuery(query) {
  const res = await axios.post('/api', { query });
  return res.data.data;
}
