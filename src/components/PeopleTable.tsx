import React from 'react';
import { Person } from 'src/models';
import PeopleRow from './PeopleRow';

interface Props {
  me: Person;
  persons: Person[];
}

export default ({ me, persons }: Props) => {
  const rows = persons.map((person, i) => {
    const isMe = person.name === me.name && person.join.toDateString() === me.join.toDateString();
    return <PeopleRow index={i} person={person} isMe={isMe} key={person.name + person.join} />;
  });

  return (
    <div id="people-table">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th className="no">#</th>
            <th className="name">이름</th>
            <th className="rank">계급</th>
            <th className="date-start">입대일</th>
            <th className="date-transfer">전입일</th>
            <th className="date-end">전역일</th>
            <th className="days-past">지난시간</th>
            <th className="days-left">남은시간</th>
            <th className="progressbar">{' '}</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  );
};
