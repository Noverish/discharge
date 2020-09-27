import {
  PRIVATE_MAX_GRADE,
  PRIVATE_FIRST_MAX_GRADE,
  CORPORAL_MAX_GRADE,
  PRIVATE_REDUCE_DATE,
  PRIVATE_FIRST_REDUCE_DATE,
  CORPORAL_REDUCE_DATE,
} from 'src/envs';
import { Person, PersonDao, Rank } from 'src/models';
import * as dateUtil from './date-util';

interface PromotionDates {
  join: Date;
  transfer: Date;
  privateFirst: Date;
  corporal: Date;
  sergeant: Date;
  discharge: Date;
}

function rankToKorean(rank: Rank) {
  switch (rank) {
    case Rank.human: return '민간인';
    case Rank.trainee: return '훈련병';
    case Rank.private: return '이병';
    case Rank.privateFirst: return '일병';
    case Rank.corporal: return '상병';
    case Rank.sergeant: return '병장';
    case Rank.fulfilled: return '예비역';
    default: throw new Error('Unexpected value');
  }
}

function calcMaxGrade(rank: Rank.private | Rank.privateFirst | Rank.corporal, join: Date): number {
  switch (rank) {
    case Rank.private: {
      const extraGrade = join.getTime() < PRIVATE_REDUCE_DATE.getTime() ? 1 : 0;
      return PRIVATE_MAX_GRADE + extraGrade;
    }
    case Rank.privateFirst: {
      const extraGrade = join.getTime() < PRIVATE_FIRST_REDUCE_DATE.getTime() ? 1 : 0;
      return PRIVATE_FIRST_MAX_GRADE + extraGrade;
    }
    case Rank.corporal: {
      const extraGrade = join.getTime() < CORPORAL_REDUCE_DATE.getTime() ? 1 : 0;
      return CORPORAL_MAX_GRADE + extraGrade;
    }
    default: throw new Error('Unexpected value');
  }
}

function calcPromotionDates(person: PersonDao): PromotionDates {
  const join = new Date(person.join);
  const transfer = new Date(person.transfer);
  const discharge = new Date(person.discharge);

  const penalty = [0, 0, 0];
  person.penalty.forEach((v) => { penalty[v] += 1; });
  const [privatePenalty, privateFirstPenalty, corporalPenalty] = penalty;

  const privateMaxGrade = calcMaxGrade(Rank.private, join) + privatePenalty;
  const privateFirstMaxGrade = calcMaxGrade(Rank.privateFirst, join) + privateFirstPenalty;
  const corporalMaxGrade = calcMaxGrade(Rank.corporal, join) + corporalPenalty;

  const privateFirst = dateUtil.addMonth(new Date(join), privateMaxGrade);
  const corporal = dateUtil.addMonth(new Date(privateFirst), privateFirstMaxGrade);
  const sergeant = dateUtil.addMonth(new Date(corporal), corporalMaxGrade);
  privateFirst.setDate(1);
  corporal.setDate(1);
  sergeant.setDate(1);

  return { join, transfer, privateFirst, corporal, sergeant, discharge };
}

function calcStatus(dates: PromotionDates, now: Date) {
  const { join, transfer, privateFirst, corporal, sergeant, discharge } = dates;

  if (now < join) {
    return { rank: Rank.human };
  }
  if (join <= now && now < transfer) {
    return { rank: Rank.trainee };
  }
  if (transfer <= now && now < privateFirst) {
    const grade = dateUtil.monthDiff(now, join) + 1;
    return { grade, rank: Rank.private };
  }
  if (privateFirst <= now && now < corporal) {
    const privateMaxGrade = dateUtil.monthDiff(corporal, privateFirst);
    const grade = dateUtil.monthDiff(now, privateFirst) + 1;
    const broken = grade > Math.ceil(privateMaxGrade / 2);
    return { grade, broken, rank: Rank.privateFirst };
  }
  if (corporal <= now && now < sergeant) {
    const corporalMaxGrade = dateUtil.monthDiff(sergeant, corporal);
    const grade = dateUtil.monthDiff(now, corporal) + 1;
    const broken = grade > Math.ceil(corporalMaxGrade / 2);
    return { grade, broken, rank: Rank.corporal };
  }
  if (sergeant <= now && now < discharge) {
    const grade = dateUtil.monthDiff(now, sergeant) + 1;
    const totalSergeantDays = dateUtil.dayDiff(discharge, sergeant);
    const currSergeantDays = dateUtil.dayDiff(now, sergeant);
    const broken = currSergeantDays > Math.ceil(totalSergeantDays / 2);
    return { grade, broken, rank: Rank.sergeant };
  }
  if (discharge <= now) {
    return { rank: Rank.fulfilled };
  }
  throw new Error('Never happend');
}

export default function processPerson(person: PersonDao, now: Date): Person {
  const promotionDates = calcPromotionDates(person);
  const { rank, grade, broken } = calcStatus(promotionDates, now);
  const rankString: string = rankToKorean(rank) + (grade ? ` ${grade}호봉` : '');

  const { join, transfer, discharge } = promotionDates;
  const daysTotal = dateUtil.dayDiff(discharge, join);
  const daysPast = Math.min(dateUtil.dayDiff(now, join), daysTotal);
  const daysLeft = Math.max(dateUtil.dayDiff(discharge, now), 0);
  const secondsTotal = dateUtil.secondDiff(discharge, join);
  const secondsPast = Math.min(dateUtil.secondDiff(now, join), secondsTotal);
  const secondsLeft = Math.max(dateUtil.secondDiff(discharge, now), 0);

  const currMs = now.getTime() - join.getTime();
  const totalMs = discharge.getTime() - join.getTime();
  const rate: number = currMs / totalMs;
  const percent: string = (Math.min(1, Math.max(rate, 0)) * 100).toFixed(2);

  return {
    join,
    transfer,
    discharge,
    rankString,
    rank,
    grade,
    broken,
    daysTotal,
    daysPast,
    daysLeft,
    secondsTotal,
    secondsPast,
    secondsLeft,
    percent,
    name: person.name,
  };
}
