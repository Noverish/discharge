export interface PersonDao {
  name: string;
  join: string;
  transfer: string;
  discharge: string;
  penalty: number[];
}

export enum Rank {
  human = 'human',
  trainee = 'trainee',
  private = 'private',
  privateFirst = 'private-first',
  corporal = 'corporal',
  sergeant = 'sergeant',
  fulfilled = 'fulfilled',
}

export interface Person {
  name: string;
  join: Date;
  transfer: Date;
  discharge: Date;
  rank: Rank;
  rankString: string;
  grade?: number;
  broken?: boolean;
  daysTotal: number;
  daysPast: number;
  daysLeft: number;
  secondsTotal: number;
  secondsPast: number;
  secondsLeft: number;
  percent: string;
}
