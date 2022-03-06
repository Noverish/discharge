import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import request from './api';
import './App.scss';
import HomePage from './page/home';
import { addOneSec, setNowDate, setPeople } from './redux';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    setInterval(() => dispatch(addOneSec()), 1000);

    request().then((peopleParam) => {
      dispatch(setPeople(peopleParam));

      const now = new Date();
      now.setFullYear(2020);
      dispatch(setNowDate(now.toISOString()));
    });
  }, [dispatch]);

  return (
    <HomePage />
  );
}
