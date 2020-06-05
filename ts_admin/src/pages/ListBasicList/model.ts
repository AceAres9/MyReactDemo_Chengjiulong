import { Effect, Reducer } from 'umi';
import {
  addFakeList, queryFakeList, removeFakeList, updateFakeList, queryProductList
} from './service';

import { Data } from './data.d';

export interface StateType {
  proList: Data[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    proFetch: Effect;
    appendFetch: Effect;
    submit: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    appendList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'listBasicList',

  state: {
    proList: []
  },

  effects: {
    *proFetch({ payload }, { call, put }) {
      const response = yield call(queryProductList, payload);
      yield put({
        type: 'queryList',
        payload: response ? response.data : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      } else {
        callback = addFakeList;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        proList: action.payload,
      };
    },
    appendList(state = { proList: [] }, action) {
      return {
        ...state,
        list: state.proList.concat(action.payload),
      };
    },
  },
};

export default Model;
