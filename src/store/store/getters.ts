import { GetterTree } from 'vuex';
import moment from 'moment';

import { IWorkHour } from '@models/IStore';

import { StateInterface } from '../index';
import { IStoreState } from './state';

const getters: GetterTree<IStoreState, StateInterface> = {
  store(state: IStoreState) {
    return state.store;
  },

  theme(state: IStoreState) {
    return state.store?.theme;
  },

  isStoreOpen(state: IStoreState) {
    if (!state.store) {
      return false;
    }

    const todayWorkHours = state.store.workHours
      .filter((workHour: IWorkHour) => {
        return workHour.weekDay === moment().weekday();
      });

    return todayWorkHours.some((workHour: IWorkHour) => {
      const { startTime, endTime } = workHour;

      const now = moment();
      const todayAsMinutes = (now.hours() * 60) + now.minutes();

      return todayAsMinutes >= startTime && todayAsMinutes <= endTime;
    });
  },
};

export default getters;
