/* global describe, it, beforeEach, expect, jest */
import { resetKeaCache, kea, activatePlugin } from 'kea';
import PropTypes from 'prop-types';
import sagaPlugin from 'kea-saga';
import { put, call } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';

import { options } from './keaState';
import { skillsAPI } from './skillsAPI';
import store from './store';

activatePlugin(sagaPlugin);

describe('SkillEditor state', () => {
  const logic = kea(options);

  beforeEach(() => {
    resetKeaCache();
  });

  describe('Configuration', () => {
    it('has the correct paths in the redux store', () => {
      expect(logic.path).toEqual(['cw']);
    });
  });

  describe('Actions', () => {
    it('registered all actions', () => {
      const actionNames = Object.keys(logic.actions);
      expect(actionNames).toEqual([
        // Loading
        'startLoading',
        'setSkills',
        // Adding
        'setValue',
        'setValues',
        'submit',
        'submitSuccess',
        'submitFailure',
        // Removing
        'remove',
        'removeSuccess',
        'removeFailure'
      ]);
    });

    it('has the correct payload on every action', () => {
      const { actions } = logic;
      const {
        startLoading,
        setSkills,
        setValue,
        setValues,
        submit,
        submitSuccess,
        submitFailure,
        remove,
        removeSuccess
      } = actions;

      expect(startLoading()).toEqual({
        payload: { value: true },
        type: 'start loading (cw)'
      });
      expect(setSkills('test')).toEqual({
        payload: 'test',
        type: 'set skills (cw)'
      });
      expect(setValue('key', 'value')).toEqual({
        payload: { key: 'key', value: 'value' },
        type: 'set value (cw)'
      });
      expect(setValues('test')).toEqual({
        payload: { values: 'test' },
        type: 'set values (cw)'
      });
      expect(submit()).toEqual({
        payload: { value: true },
        type: 'submit (cw)'
      });
      expect(submitSuccess('test')).toEqual({
        payload: 'test',
        type: 'submit success (cw)'
      });
      expect(submitFailure()).toEqual({
        payload: { value: true },
        type: 'submit failure (cw)'
      });
      expect(remove(1)).toEqual({ payload: 1, type: 'remove (cw)' });
      expect(removeSuccess(1)).toEqual({
        payload: 1,
        type: 'remove success (cw)'
      });
    });
  });

  describe('Reducers', () => {
    it('registered all reducers', () => {
      const reducersName = Object.keys(logic.reducers);
      expect(reducersName).toEqual([
        'values',
        'isLoading',
        'isSubmitting',
        'skills'
      ]);
    });

    it('updates the values', () => {
      const { reducer, actions, defaults } = logic;
      const { setValue, setValues, submitSuccess } = actions;

      expect(defaults.values).toEqual({ name: '', experience: '' });

      const setValueResult = reducer({}, setValue('name', 'test'));
      expect(setValueResult.values).toEqual({ name: 'test', experience: '' });

      const setValuesResult = reducer({}, setValues({ experience: 'test' }));
      expect(setValuesResult.values).toEqual({ name: '', experience: 'test' });

      const submitSuccessResult = reducer(
        { values: { name: 'test', experience: 'test2' } },
        submitSuccess()
      );
      expect(submitSuccessResult.values).toEqual({ name: '', experience: '' });
    });

    it('toggles the loading state', () => {
      const { reducer, actions, defaults, propTypes } = logic;
      const { startLoading, setSkills } = actions;

      expect(defaults.isLoading).toEqual(false);
      expect(propTypes.isLoading).toEqual(PropTypes.bool);

      const loadingResult = reducer({}, startLoading());
      expect(loadingResult.isLoading).toEqual(true);

      const skillsResult = reducer({}, setSkills([]));
      expect(skillsResult.isLoading).toEqual(false);
    });

    it('toggles the submitting state', () => {
      const { reducer, actions, defaults, propTypes } = logic;
      const { submit, submitSuccess, submitFailure } = actions;

      expect(defaults.isSubmitting).toEqual(false);
      expect(propTypes.isSubmitting).toEqual(PropTypes.bool);

      const submitResult = reducer({}, submit());
      expect(submitResult.isSubmitting).toEqual(true);

      const submitSuccessResult = reducer(
        { isSubmitting: true },
        submitSuccess()
      );
      expect(submitSuccessResult.isSubmitting).toEqual(false);

      const submitFailureResult = reducer(
        { isSubmitting: true },
        submitFailure()
      );
      expect(submitFailureResult.isSubmitting).toEqual(false);
    });

    it('updates the skills', () => {
      const { reducer, actions, defaults, propTypes } = logic;
      const { submitSuccess, setSkills, removeSuccess } = actions;

      expect(defaults.skills).toEqual([]);
      expect(propTypes.skills).toEqual(PropTypes.array);

      const submitSuccessResult = reducer(
        { skills: ['test'] },
        submitSuccess('test2')
      );
      expect(submitSuccessResult.skills).toEqual(['test', 'test2']);

      const setSkillsResult = reducer(
        { skills: ['test'] },
        setSkills(['test2'])
      );
      expect(setSkillsResult.skills).toEqual(['test2']);

      const removeSuccessResult = reducer(
        { skills: [{ id: 1 }, { id: 2 }] },
        removeSuccess(1)
      );
      expect(removeSuccessResult.skills).toEqual([{ id: 2 }]);
    });
  });

  describe('Sagas', () => {
    it('starts loading skills when the loadSkills worker is executed', () => {
      const { workers, actions } = logic;
      const { startLoading, setSkills, submitFailure } = actions;
      const { loadSkills } = workers;
      const gen = cloneableGenerator(loadSkills)();
      expect(gen.next()).toEqual({ done: false, value: put(startLoading()) });
      expect(gen.next()).toEqual({
        done: false,
        value: call(skillsAPI.getSkills)
      });
      const error = gen.clone();
      expect(gen.next({ data: [] })).toEqual({
        done: false,
        value: put(setSkills([]))
      });
      expect(error.throw()).toEqual({
        done: false,
        value: put(submitFailure())
      });
      expect(gen.next()).toEqual({ done: true, value: undefined });
      expect(error.next()).toEqual({ done: true, value: undefined });
    });

    it('removes a skill when when the removeSkill worker is executed', () => {
      const { workers, actions } = logic;
      const { removeSuccess, removeFailure } = actions;
      const { removeSkill } = workers;
      const args = { payload: 1 };
      const gen = cloneableGenerator(removeSkill)(args);
      expect(gen.next()).toEqual({
        done: false,
        value: call(skillsAPI.removeSkill, 1)
      });
      const error = gen.clone();
      expect(gen.next()).toEqual({ done: false, value: put(removeSuccess(1)) });
      expect(error.throw()).toEqual({
        done: false,
        value: put(removeFailure())
      });
      expect(gen.next()).toEqual({ done: true, value: undefined });
      expect(error.next()).toEqual({ done: true, value: undefined });
    });

    it('submits a skill when when the submitSkill worker is executed', () => {
      const { workers, actions, get } = logic;
      const { submitSuccess, submitFailure } = actions;
      const { submitSkill } = workers;
      const gen = cloneableGenerator(submitSkill)();
      expect(gen.next()).toEqual({ done: false, value: get('values') });
      expect(gen.next(1)).toEqual({
        done: false,
        value: call(skillsAPI.addSkill, 1)
      });
      const error = gen.clone();
      const args = { data: 1 };
      expect(gen.next(args)).toEqual({
        done: false,
        value: put(submitSuccess(1))
      });
      expect(error.throw()).toEqual({
        done: false,
        value: put(submitFailure())
      });
      expect(gen.next()).toEqual({ done: true, value: undefined });
      expect(error.next()).toEqual({ done: true, value: undefined });
    });

    it('Execute the start task when the saga is run and start loading skills', () => {
      const sagaMiddleware = store._sagaMiddleware;
      sagaMiddleware.run(logic.saga);
      const startSpy = jest.spyOn(options, 'start');
      const startLoadingSpy = jest.spyOn(options.workers, 'loadSkills');
      setTimeout(() => {
        expect(startSpy).toHaveBeenCalledTimes(1);
        expect(startLoadingSpy).toHaveBeenCalledTimes(1);
        startSpy.mockRestore();
        startLoadingSpy.mockRestore();
      });
    });
  });
});
