import { useEffect, useState } from 'react';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL + '/api/report';

const Report = () => {
  const is_staff = localStorage.getItem('is_staff') === 'true';
  const [reportData, setReportData] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(URL);
      const data = res.data;
      setReportData(data);
    };
    if (!is_staff) {
      return;
    }
    fetch();
  }, [is_staff]);
  if (!is_staff) {
    return <div>You can't access this page</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-40">
      <h1 className="text-3xl text-center mb-4">Report</h1>
      <div className="max-w-md bg-white p-4 rounded shadow-md mx-auto">
        <div className="flex flex-row justify-between mb-2 font-bold">
          <span className="text-lg">Country</span>
          <span className="text-lg">Percent</span>
        </div>
        {Object.keys(reportData).map((country, index) => (
          <div key={index} className="flex flex-row justify-between mb-2">
            <span className="text-lg">{country}</span>
            <span className="text-lg">{(reportData[country] * 100).toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Report;
