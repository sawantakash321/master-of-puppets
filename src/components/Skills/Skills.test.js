/* globals describe, it, expect, jest */
import React from 'react';
import ReactDOM from 'react-dom';
import Skills from './Skills';
import renderer from 'react-test-renderer';

describe('Skills component', function() {
  const skillsData = [
    {
      id: 1,
      name: 'Express',
      experience: '<1 year'
    },
    {
      id: 2,
      name: 'Node.js',
      experience: '5-7 years'
    }
  ];

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Skills />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders a skill list', () => {
    const skill = mount(<Skills skills={skillsData} />);
    const wrapper = skill.find('.skills');
    expect(wrapper.length).toEqual(1);
    const skills = wrapper.find('.skill');
    expect(skills.length).toEqual(2);
    skills.forEach((s, idx) => {
      const item = skillsData[idx];
      const node = s.getDOMNode();
      const ti = node.attributes.getNamedItem('tabindex');
      expect(ti).toBeTruthy();
      expect(ti.value).toEqual('0');
      const skillNumber = s.find('.skill-number');
      expect(skillNumber.length).toEqual(1);
      expect(skillNumber.text()).toEqual((idx + 1).toString());
      const skillName = s.find('.skill-name');
      expect(skillName.length).toEqual(1);
      expect(skillName.text()).toEqual(item.name);
      const skillExp = s.find('.skill-experience');
      expect(skillExp.length).toEqual(1);
      expect(skillExp.text()).toEqual(item.experience);
      const skillRemove = s.find('.skill-remove');
      expect(skillRemove.length).toEqual(1);
      expect(skillRemove.name()).toEqual('button');
      expect(skillRemove.text()).toEqual('+');
    });
  });

  it('removes skills by pressing the remove button', () => {
    const onRemove = jest.fn();
    const skill = shallow(<Skills skills={skillsData} onRemove={onRemove} />);
    const button = skill.find('.skill-remove').at(1);
    button.simulate('click');
    expect(onRemove).toHaveBeenCalledWith(2);
  });

  it('changes the tab index of skills', () => {
    const skill = mount(<Skills skills={skillsData} tabIndex={100} />);
    const skills = skill.find('.skill');
    skills.forEach(s => {
      const node = s.getDOMNode();
      const tbi = node.attributes.getNamedItem('tabindex');
      expect(tbi).toBeTruthy();
      expect(tbi.value).toEqual('100');
    });
  });

  // Snapshot test
  it('matches the snapshot', () => {
    const props = {
      tabindex: 100,
      items: skillsData
    };
    const events = {
      onRemove: jest.fn()
    };
    const tree = renderer.create(<Skills {...props} {...events} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
