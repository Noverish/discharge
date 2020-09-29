import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DISCHARGE_START_DATE } from 'src/envs';
import { RootState, setNow } from 'src/redux';
import { dateUtil } from 'src/utils';

export default () => {
  const dispatch = useDispatch();
  const people = useSelector((state: RootState) => state.people);
  const now = new Date(useSelector((state: RootState) => state.now));

  const min = dateUtil.dayDiff(new Date(DISCHARGE_START_DATE), new Date());
  const max = (people.length > 0)
    ? dateUtil.dayDiff(new Date(people[people.length - 1].discharge), new Date())
    : dateUtil.dayDiff(new Date(Date.now() + 1), new Date());
  const value = dateUtil.dayDiff(now, new Date());

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const n = dateUtil.addDay(new Date(), value);
    dispatch(setNow(n.getTime()));
  }, [dispatch]);

  return (
    <input type="range" min={min} max={max} value={value} onChange={onChange} />
  )
}