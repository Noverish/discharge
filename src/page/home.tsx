import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DateRangeInput, Header, InfoPane, PeopleTable, SettingModal, WelcomeOverlay } from 'src/components';
import { WelcomeStatus } from 'src/components/WelcomeOverlay';
import { FULFILLED_REMAIN_DAYS, WELCOME_SHOW_MILLIS } from 'src/envs';
import { defaultPerson, Person } from 'src/models';
import { RootState } from 'src/redux';
import { dateUtil, processToPerson } from 'src/utils';

export default function HomePage() {
  const [welcomeStatus, setWelcomeStatus] = useState(WelcomeStatus.showing);
  const people = useSelector((state: RootState) => state.people);
  const now = new Date(useSelector((state: RootState) => state.now));
  const { name } = useSelector((state: RootState) => state.setting);

  useEffect(() => {
    setWelcomeStatus(WelcomeStatus.showing);
    setTimeout(() => setWelcomeStatus(WelcomeStatus.closing), WELCOME_SHOW_MILLIS);
  }, [people]);

  const persons: Person[] = people
    .filter((p) => dateUtil.dayDiff(now, new Date(p.discharge)) < FULFILLED_REMAIN_DAYS)
    .filter((p) => new Date(p.transfer) < now)
    .map((p) => processToPerson(p, now));

  const me = (name)
    ? processToPerson(people.find(v => v.name === name)!, now)
    : persons[0];
  const me2 = me || defaultPerson;

  return (
    <>
      <WelcomeOverlay
        person={me2}
        status={welcomeStatus}
        onTransitionEnd={() => setWelcomeStatus(WelcomeStatus.closed)}
      />
      <Header className={classnames({ blur: welcomeStatus !== WelcomeStatus.closed })} />
      <div className={classnames('container-fluid', { blur: welcomeStatus !== WelcomeStatus.closed })} style={{ marginTop: '60px' }}>
        <InfoPane person={me2} />
        <h1>{new Date(now).toLocaleString()}</h1>
        <DateRangeInput />
        <PeopleTable me={me2} persons={persons} />
      </div>
      <SettingModal />
    </>
  );
}
