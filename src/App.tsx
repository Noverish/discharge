import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';

import { DateRangeInput, Header, InfoPane, PeopleTable, SettingModal, WelcomeOverlay } from './components';
import { FULFILLED_REMAIN_DAYS, WELCOME_SHOW_MILLIS } from './envs';
import { WelcomeStatus } from './components/WelcomeOverlay';
import { addOneSec, RootState, setPeople } from './redux';
import { dateUtil, processToPerson } from './utils';
import { Person } from './models';
import request from './api';
import './App.scss';

export default function App() {
  const dispatch = useDispatch();
  const [welcomeStatus, setWelcomeStatus] = useState(WelcomeStatus.showing);
  const people = useSelector((state: RootState) => state.people);
  const now = new Date(useSelector((state: RootState) => state.now));
  const { name } = useSelector((state: RootState) => state.setting);

  useEffect(() => {
    request()
      .then((peopleParam) => {
        dispatch(setPeople(peopleParam));

        setInterval(
          () => dispatch(addOneSec()),
          1000,
        );
      });
  }, [dispatch]);

  useEffect(() => {
    setWelcomeStatus(WelcomeStatus.showing);
    setTimeout(() => setWelcomeStatus(WelcomeStatus.closing), WELCOME_SHOW_MILLIS);
  }, [people]);

  if (people.length === 0) {
    return <div />;
  }

  const persons: Person[] = people
    .filter((p) => dateUtil.dayDiff(now, new Date(p.discharge)) < FULFILLED_REMAIN_DAYS)
    .filter((p) => new Date(p.transfer) < now)
    .map((p) => processToPerson(p, now));

  const me = (name)
    ? processToPerson(people.find(v => v.name === name)!, now)
    : persons[0];

  return (
    <>
      <WelcomeOverlay
        person={me}
        status={welcomeStatus}
        onTransitionEnd={() => setWelcomeStatus(WelcomeStatus.closed)}
      />
      <Header className={classnames({ blur: welcomeStatus !== WelcomeStatus.closed })} />
      <div className={classnames('container-fluid', { blur: welcomeStatus !== WelcomeStatus.closed })} style={{ marginTop: '60px' }}>
        <InfoPane person={me} />
        <h1>{new Date(now).toLocaleString()}</h1>
        <DateRangeInput />
        <PeopleTable me={me} persons={persons} />
      </div>
      <SettingModal />
    </>
  );
}
