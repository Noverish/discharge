import classnames from 'classnames';
import React from 'react';
import { CAN_DISCHARGE_DAY } from 'src/envs';
import { Person } from 'src/models';
import { dateUtil } from 'src/utils';

const { dateToString } = dateUtil;

interface Props {
  person: Person;
}

export default function InfoPane({ person }: Props) {
  const { name, join, transfer, discharge, rank, rankString, broken, daysLeft, percent } = person;

  const canDischarge = daysLeft < CAN_DISCHARGE_DAY;
  const dates = `${dateToString(join)} 입대 - ${dateToString(transfer)} 전입 - ${dateToString(discharge)} 전역`;

  return (
    <div id="info-pane" className="panel">
      <div className={classnames('panel-heading', `rank-${rank}`, { broken })} />
      <div className="panel-body">
        <div className="name-info">
          <strong className="name">{name}</strong>
          <span className="rank">{rankString}</span>
          <div>
            당신의 전역은
            {' '}
            <span className={classnames('bold', canDischarge ? 'dischargable' : 'not-dischargable')}>
              {canDischarge ? '가능' : '불가'}
            </span>
            합니다.
          </div>
        </div>
        <div className="date-info">
          <div className="dday">
            <div className={classnames('hex', `rank-${rank}`, { broken })}>
              D-0x
              <span className="bold">
                {daysLeft.toString(16).toUpperCase()}
                <sub>(16)</sub>
              </span>
            </div>
            <span className="percentage">
              {percent}
              %
            </span>
          </div>
          <div>
            {dates}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          개인정보보호를 위해 가명을 사용했습니다.
          <br />
          이 데이터에 본인이 있는 것 같은 경우 상단의 Settings를 클릭해보세요.
        </div>
      </div>
    </div>
  );
};
