import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const URL = process.env.REACT_APP_BACKEND_URL + '/api/questions';
const ANSWER_API_URL = process.env.REACT_APP_BACKEND_URL + '/api/answer';

const USER_API_URL = process.env.REACT_APP_BACKEND_URL + '/api/users';

const Home = () => {
  const name = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const isLoggedIn = name && email;

  const [quizData, setQuizData] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const username = localStorage.getItem('username');
        axios
          .get(`${process.env.REACT_APP_BACKEND_URL}/api/users/${username}/`)
          .then((response) => {
            if (response.data.has_submitted) {
              setHasSubmitted(true);
            } else {
              setHasSubmitted(false);
            }
          })
          .catch((error) => {
            console.error(error);
          });

        if (!hasSubmitted) {
          const res = await axios.get(URL);
          const data = res.data;
          setQuizData(data);

          const blankAnswer = Array(data.length).fill('');
          for (const [idx, item] of data.entries()) {
            const apiData = { username: name, question_id: item.id };
            try {
              const response = await axios.get(ANSWER_API_URL, {
                params: apiData
              });
              blankAnswer[idx] = response.data.answer;
            } catch {
              blankAnswer[idx] = '';
            }
          }
          setAnswer(blankAnswer);
        }
      } catch (error) {
        toast.error(`Error fetching quiz data or submission status: ${error}`);
      }
    };

    if (isLoggedIn) {
      fetchItems();
    }
  }, [isLoggedIn, name, email]);

  const onAnswerChange = (event, idx) => {
    const copyAnswer = [...answer];
    copyAnswer[idx] = event.target.value;
    setAnswer(copyAnswer);
  };

  const handleSubmit = async () => {
    try {
      for (let i = 0; i < answer.length; i++) {
        if (!answer[i]) {
          toast.error('You have to answer all the questions.');
          return;
        }
      }
      const csrftoken = Cookies.get('csrftoken');
      for (let i = 0; i < quizData.length; i++) {
        const apiData = {
          username: name,
          question_id: quizData[i].id,
          answer: answer[i]
        };
        await axios.post(ANSWER_API_URL, apiData, {
          headers: {
            'X-CSRFToken': csrftoken
          },
          withCredentials: true
        });
      }
      setHasSubmitted(true);
      const response = await axios.patch(
        `${USER_API_URL}/${name}/`,
        {
          has_submitted: true
        },
        {
          headers: {
            'X-CSRFToken': csrftoken
          },
          withCredentials: true
        }
      );
    } catch (error) {
      toast.error(`Error submitting answers: ${error}`);
    }
  };
  if (hasSubmitted) {
    return (
      <div className="max-w-md bg-white p-4 rounded shadow-md mx-auto mt-20">
        <h2 className="text-3xl text-center mb-4">You already submitted!</h2>
        <p className="text-lg text-center">
          Go to{' '}
          <Link to="/answer" className="text-blue-600 hover:text-blue-800">
            Results
          </Link>{' '}
          to see your score!
        </p>
      </div>
    );
  } else {
    return (
      <div className="w-full justify-center items-center flex flex-col gap-12 h-screen p-8">
        {!isLoggedIn && (
          <>
            <h1 className="font-semibold text-[80px]">Math Quiz</h1>
            <div className="flex flex-row gap-4">
              <a
                href="/login"
                className="focus:outline-none text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-500 dark:hover:bg-purple-600 dark:focus:ring-purple-800"
              >
                LogIn
              </a>
              <a
                href="/register"
                className="focus:outline-none text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-500 dark:hover:bg-purple-600 dark:focus:ring-purple-800"
              >
                SignUp
              </a>
            </div>
          </>
        )}
        {isLoggedIn && (
          <div className="w-full max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 max-h-[calc(100%-100px)] overflow-auto">
            <div className="text-xl">Math Quiz</div>
            <div className="flex flex-col gap-4">
              {!!quizData &&
                quizData.map((item, idx) => (
                  <div
                    className="flex flex-col sm:flex-row justify-between items-center gap-2"
                    key={item.id}
                  >
                    <div className="w-full">{item.text}</div>
                    <input
                      value={answer[idx]}
                      onChange={(e) => onAnswerChange(e, idx)}
                      disabled={hasSubmitted}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    />
                  </div>
                ))}
            </div>
            <button
              disabled={hasSubmitted}
              onClick={handleSubmit}
              className="mt-4 focus:outline-none text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-500 dark:hover:bg-purple-600 dark:focus:ring-purple-800 disabled:bg-slate-600"
            >
              Submit Answers
            </button>
          </div>
        )}
      </div>
    );
  }
};

export default Home;
