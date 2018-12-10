import React from 'react';
import PropTypes from 'prop-types';

const Skills = function({ skills = [], onRemove, tabIndex }) {
  const skillsIndex = tabIndex || 0;
  return (
    <ul className="skills">
      {skills.map((skill, idx) => (
        <li key={skill.id} className="skill" tabIndex={skillsIndex}>
          <div className="skill-number">{idx + 1}</div>
          <div className="skill-content">
            <div className="skill-name">{skill.name}</div>
            <div className="skill-experience">{skill.experience}</div>
          </div>
          <button
            type="button"
            className="skill-remove"
            onClick={() => onRemove(skill.id)}
          >
            <span className="remove-sign">+</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

Skills.propTypes = {
  tabIndex: PropTypes.number,
  skills: PropTypes.array,
  onRemove: PropTypes.func
};

export default Skills;
