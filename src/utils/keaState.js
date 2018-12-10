import { kea } from 'kea';
import { put, call } from 'redux-saga/effects';
import { skillsAPI } from './skillsAPI';
import PropTypes from 'prop-types';

const formDefaults = {
  name: '',
  experience: ''
};

const skillDefaults = [];

const propTypes = {
  name: PropTypes.string,
  experience: PropTypes.string
};

export const options = {
  path: () => ['cw'],
  actions: () => ({
    startLoading: true,
    setSkills: skills => skills,
    setValue: (key, value) => ({ key, value }),
    setValues: values => ({ values }),
    submit: true,
    submitSuccess: skill => skill,
    submitFailure: true,
    remove: id => id,
    removeSuccess: id => id,
    removeFailure: true
  }),
  reducers: ({ actions }) => ({
    values: [
      formDefaults,
      PropTypes.shape(propTypes),
      {
        [actions.setValue]: (state, payload) => {
          return { ...state, [payload.key]: payload.value };
        },
        [actions.setValues]: (state, payload) => {
          return { ...state, ...payload.values };
        },
        [actions.submitSuccess]: () => formDefaults
      }
    ],
    isLoading: [
      false,
      PropTypes.bool,
      {
        [actions.startLoading]: () => true,
        [actions.setSkills]: () => false
      }
    ],
    isSubmitting: [
      false,
      PropTypes.bool,
      {
        [actions.submit]: () => true,
        [actions.submitSuccess]: () => false,
        [actions.submitFailure]: () => false
      }
    ],
    skills: [
      skillDefaults,
      PropTypes.array,
      {
        [actions.submitSuccess]: (state, payload) => {
          return [...state, payload];
        },
        [actions.setSkills]: (state, payload) => {
          return payload;
        },
        [actions.removeSuccess]: (state, payload) => {
          return [...state.filter(s => s.id !== payload)];
        }
      }
    ]
  }),
  takeLatest: ({ actions, workers }) => ({
    [actions.submit]: workers.submitSkill
  }),
  takeEvery: ({ actions, workers }) => ({
    [actions.remove]: workers.removeSkill
  }),
  *start() {
    yield this.workers.loadSkills();
  },
  workers: {
    *loadSkills() {
      const { setSkills, startLoading, submitFailure } = this.actions;
      try {
        yield put(startLoading());
        const response = yield call(skillsAPI.getSkills);
        yield put(setSkills(response.data));
      } catch (e) {
        yield put(submitFailure());
      }
    },
    *removeSkill({ payload }) {
      const { removeSuccess, removeFailure } = this.actions;
      try {
        yield call(skillsAPI.removeSkill, payload);
        yield put(removeSuccess(payload));
      } catch (e) {
        yield put(removeFailure());
      }
    },
    *submitSkill() {
      const { submitSuccess, submitFailure } = this.actions;
      const skill = yield this.get('values');
      try {
        const response = yield call(skillsAPI.addSkill, skill);
        yield put(submitSuccess(response.data));
      } catch (e) {
        yield put(submitFailure());
      }
    }
  }
};

export default kea(options);
