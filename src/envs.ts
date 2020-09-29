// 호봉: grade
// 계급: level, rank
// 진급: promote
// 전입: transfer
// 입대: join

export const FULFILLED_REMAIN_DAYS = 7; // 전역 후 그래프에 남겨 놓는 날짜 수
export const WELCOME_SHOW_MILLIS = 1800;
export const CAN_DISCHARGE_DAY = 31;
export const DISCHARGE_START_DATE = '2016-11-11';

// 2018년  4월 군번부터 상병이 6호봉
// 2018년 11월 군번부터 일병이 6호봉
// 2019년  6월 군번부터 이병이 3호봉
export const CORPORAL_REDUCE_DATE = new Date('2018-04-01');
export const PRIVATE_FIRST_REDUCE_DATE = new Date('2018-11-01');
export const PRIVATE_REDUCE_DATE = new Date('2019-06-01');

// 이병 최대 호봉: 3
// 일병 최대 호봉: 6
// 상병 최대 호봉: 6
export const PRIVATE_MAX_GRADE = 3;
export const PRIVATE_FIRST_MAX_GRADE = 6;
export const CORPORAL_MAX_GRADE = 6;

export const NAME_HEADER_NAME = 'x-discharge-name';
export const DATE_HEADER_NAME = 'x-discharge-date';
export const TARGET_DATE_NAME = 'x-discharge-target-date';
