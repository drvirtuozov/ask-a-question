import { store } from '../components/App';
import { getQuestions } from '../requests/api';
import { setQuestions } from '../actions/questions';
import { setQuestionsCount } from '../actions/questionsCount';


export default async function () {
  const res = await getQuestions();
  store.dispatch(setQuestions(res.questions));
  store.dispatch(setQuestionsCount(res.questions.length));
}
