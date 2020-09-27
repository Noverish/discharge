import React, { useState, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import axios, { AxiosResponse } from 'axios';

import { FULFILLED_REMAIN_DAYS, WELCOME_SHOW_MILLIS, DISCHARGE_START_DATE } from './envs';
import { Header, InfoPane, PeopleTable, WelcomeOverlay } from './components';
import { WelcomeStatus } from './components/WelcomeOverlay';
import { Person, PersonDao } from './models';
import { dateUtil, processToPerson } from './utils';
import './App.scss';

export default function App() {
  const [welcomeStatus, setWelcomeStatus] = useState(WelcomeStatus.showing);
  const [people, setPeople] = useState([] as PersonDao[]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    axios({ url: 'http://home.hyunsub.kim:4284' })
      .then((res: AxiosResponse) => {
        setPeople(res.data);
      });

    setInterval(
      () => setNow((n) => dateUtil.addSecond(new Date(n), 1)),
      1000,
    );

    setTimeout(() => setWelcomeStatus(WelcomeStatus.closing), WELCOME_SHOW_MILLIS);
  }, []);

  const onRangeChnage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const n = dateUtil.addDay(new Date(), value);
    setNow(n);
  }, []);

  const persons: Person[] = people
    .filter((p) => dateUtil.dayDiff(now, new Date(p.discharge)) < FULFILLED_REMAIN_DAYS)
    .filter((p) => new Date(p.transfer) < now)
    .map((p) => processToPerson(p, now));

  if (persons.length === 0) {
    return <div />;
  }

  const me = persons[0];

  const min = dateUtil.dayDiff(new Date(DISCHARGE_START_DATE), new Date());
  const max = (people.length > 0)
    ? dateUtil.dayDiff(new Date(people[people.length - 1].discharge), new Date())
    : dateUtil.dayDiff(new Date(Date.now() + 1), new Date());
  const value = dateUtil.dayDiff(now, new Date());

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
        <h1>{now.toLocaleString()}</h1>
        <input type="range" min={min} max={max} value={value} onChange={onRangeChnage} />
        <PeopleTable me={me} persons={persons} />
      </div>
    </>
  );
}
