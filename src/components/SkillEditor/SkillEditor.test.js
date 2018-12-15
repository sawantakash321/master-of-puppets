/* global jest, describe, it, expect */
import React from 'react';
import ReactDOM from 'react-dom';
import { resetKeaCache, getStore } from 'kea';
import { compose } from 'redux';
import { Provider } from 'react-redux';
import sagaPlugin from 'kea-saga';
import renderer from 'react-test-renderer';
import logic from '../../utils/keaState';
import SkillEditor from './SkillEditor';

/* region Test setup*/
function getTestingStore() {
  resetKeaCache();
  return getStore({
    plugins: [sagaPlugin],
    paths: ['cw'],
    reducers: {},
    preloadedState: undefined,
    middleware: [],
    compose: compose,
    enhancers: []
  });
}

function getFakeStore() {
  return {
    dispatch: jest.fn(),
    subscribe: jest.fn(),
    getState: () => {
      return { cw: { values: {} } };
    }
  };
}

/* endregion */

describe('Design page', function() {
  it('renders without crashing', () => {
    const fakeStore = getFakeStore();
    const div = document.createElement('div');
    ReactDOM.render(<SkillEditor store={fakeStore} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('disable the submit button if there are no values on the form', () => {
    const fakeStore = getFakeStore();
    const design = mount(<SkillEditor store={fakeStore} />);
    const submit = design.find('button[type="submit"]');
    const submitNode = submit.getDOMNode();
    expect(submitNode.attributes.getNamedItem('disabled')).toBeTruthy();
  });

  // Snapshot test
  it('matches the snapshot', () => {
    const store = getFakeStore();

    const tree = renderer.create(<SkillEditor store={store} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
