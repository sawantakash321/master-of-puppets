import React, { Component } from 'react';
import { connect } from 'kea';
import classNames from 'classnames';
import { Select, Skills } from '../index';
import state from '../../utils/keaState';
import experiences from '../../utils/experienceItems';

@connect({
  actions: [state, ['setValue', 'submit', 'remove']],
  props: [state, ['values', 'isSubmitting', 'isLoading', 'skills']]
})
class SkillEditor extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(evt) {
    evt.preventDefault();
    const { actions } = this.props;
    const { submit } = actions;
    submit();
  }

  render() {
    const { values, isSubmitting, isLoading, skills, actions } = this.props;
    const validName =
      values.name && values.name.length >= 4 && values.name.length <= 255;
    const canSubmit =
      validName && values.experience && !isSubmitting && !isLoading;

    return (
      <div className="page">
        <form onSubmit={this.onSubmit}>
          <label htmlFor="skill" className="form-label">
            Add your skills
          </label>
          <div className="inline-form">
            <input
              id="skill"
              name="skill"
              type="text"
              placeholder="Node JS, Postgres, React, etc."
              value={values.name}
              onChange={e => actions.setValue('name', e.target.value)}
              minLength={4}
              maxLength={255}
              className={classNames({ invalid: !validName })}
            />
            <Select
              items={experiences}
              value={values.experience}
              id="experience"
              name="experience"
              placeholder="Experience"
              onChange={e => actions.setValue('experience', e.target.value)}
            />
            <button type="submit" className="btn" disabled={!canSubmit}>
              Add your skills
            </button>
          </div>
        </form>
        <Skills skills={skills} onRemove={actions.remove} />
      </div>
    );
  }
}

export default SkillEditor;
