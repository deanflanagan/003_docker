import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const USER_API_URL = process.env.REACT_APP_BACKEND_URL + '/api/users';
const ANSWER_API_URL = process.env.REACT_APP_BACKEND_URL + '/api/answer';


const Result = () => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(USER_API_URL + '/' + localStorage.getItem('username'))
      .then((response) => {
        if (response.status === 403) {
          navigate('/login', { replace: true });
        } else if (response.data.has_submitted) {
          setHasSubmitted(true);
          axios
            .get(ANSWER_API_URL + '?username=' + localStorage.getItem('username'))
            .then((response) => {
              const correctAnswers = response.data.answers.filter(
                (answer) => answer.is_correct
              );
              setPercentage(
                (correctAnswers.length / response.data.answers.length) * 100
              );
            });
        }
      });
  }, []);

  return (
    <div className="container mx-auto p-4 mt-40">
      <div className="max-w-md bg-white p-4 rounded shadow-md mx-auto">
        <h1 className="text-3xl text-center mb-4">Result</h1>
        {hasSubmitted ? (
          <div className="text-center">
            <p className="text-lg">You scored:</p>
            <p className="text-5xl">{percentage.toFixed(2)}%</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg">You have not submitted your answers yet!</p>
            <p>
              Go back to the <Link to="/">homepage</Link> to submit your answers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;

