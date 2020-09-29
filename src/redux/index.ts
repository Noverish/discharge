import { combineReducers, configureStore, createSlice } from '@reduxjs/toolkit';

import { PersonDao } from 'src/models';
import { dateUtil } from 'src/utils';

const peopleSlice = createSlice({
  name: 'people',
  initialState: [] as PersonDao[],
  reducers: {
    setPeople: (_, act) => act.payload,
  }
})

const nowSlice = createSlice({
  name: 'now',
  initialState: new Date().getTime(),
  reducers: {
    setNow: (_, act: { payload: number, type: string }) => act.payload,
    addOneSec: (state) => state + 1000,
    setNowDate: (state, act: { payload: string, type: string }) => dateUtil.setDate(new Date(state), new Date(act.payload)).getTime(),
  }
})

const settingSlice = createSlice({
  name: 'setting',
  initialState: { name: '', date: '', target: '' },
  reducers: {
    setSetting: (_, act) => act.payload,
  }
});

const rootReducer = combineReducers({
  people: peopleSlice.reducer,
  now: nowSlice.reducer,
  setting: settingSlice.reducer,
});

export const store = configureStore({ reducer: rootReducer })

export type RootState = ReturnType<typeof rootReducer>;

export type RootDispatch = typeof store.dispatch;

export const { addOneSec, setNow, setNowDate } = nowSlice.actions;
export const { setPeople } = peopleSlice.actions;
export const { setSetting } = settingSlice.actions;
