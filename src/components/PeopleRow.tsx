import classnames from 'classnames';
import React from 'react';
import { Person } from 'src/models';
import { dateUtil } from 'src/utils';

const { dateToString, secondsToString } = dateUtil;

interface Props {
  index: number;
  person: Person;
  isMe: boolean;
}

export default function PeopleRow({ index, person, isMe }: Props) {
  const {
    rank,
    rankString,
    broken,
    percent,
    daysPast,
    daysTotal,
    secondsPast,
    secondsLeft,
  } = person;

  const active = !['fulfilled', 'human'].includes(rank.toString());
  const progressParentClasses = classnames('progress', {
    active,
    'progress-striped': active,
  });
  const progressClasses = classnames(
    'progress-bar',
    `rank-${rank}`,
    { broken },
  );

  const textInside = parseInt(percent) > 20;
  const progressTextClass = classnames('text', textInside ? 'inside' : 'outside');
  const progressTextContent = `${daysPast}/${daysTotal} (${percent}%)`;
  const progressText = (daysPast > 0)
    ? <span className={progressTextClass}>{progressTextContent}</span>
    : null;

  return (
    <tr className={classnames({ me: isMe })}>
      <td>{index + 1}</td>
      <td>{person.name}</td>
      <td>{rankString}</td>
      <td>{dateToString(person.join)}</td>
      <td>{dateToString(person.transfer)}</td>
      <td>{dateToString(person.discharge)}</td>
      <td>{secondsToString(secondsPast)}</td>
      <td>{secondsToString(secondsLeft)}</td>
      <td>
        <div className={progressParentClasses}>
          <div className={progressClasses} style={{ width: `${percent}%` }}>{textInside && progressText}</div>
          {textInside || progressText}
        </div>
      </td>
    </tr>
  );
};
