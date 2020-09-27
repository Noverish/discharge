import React from 'react';
import classnames from 'classnames';
import { Person } from 'src/models';

export enum WelcomeStatus {
  showing = 'showing',
  closing = 'closing',
  closed = 'closed',
}

interface Props {
  person: Person;
  status: WelcomeStatus;
  onTransitionEnd: (event: React.TransitionEvent<HTMLDivElement>) => void;
}

export default ({ person, status, onTransitionEnd }: Props) => {
  const { daysTotal, daysLeft, daysPast, broken, rank } = person;

  // y = (total - (1 / total) * x^2) / 8
  const blurLevel = (daysTotal - (1 / daysTotal) * (daysPast ** 2)) / 8;

  const titleClasses = classnames('title', `rank-${rank}`, { broken });
  const dateClasses = classnames('date', `rank-text-${rank}`, { broken });
  const textShadow = { textShadow: `white 0 0 ${blurLevel}px` };

  return (
    <div id="welcome-layout" className={status} onTransitionEnd={onTransitionEnd}>
      <div id="welcome">
        <div className={titleClasses} style={textShadow}><strong>전역</strong></div>
        <div className={dateClasses}>
          D-
          <strong>{daysLeft}</strong>
        </div>
      </div>
    </div>
  );
};
