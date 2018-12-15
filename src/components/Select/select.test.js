/* global jest, describe, expect, it */
import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import Select from './Select';

describe('Select component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Select />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders a placeholder', () => {
    const select = shallow(<Select placeholder="test" />);
    const placeholder = select.find('option.placeholder');
    expect(placeholder.length).toEqual(1);
    expect(placeholder.hasClass('placeholder')).toBeTruthy();
    expect(placeholder.html()).toEqual(
      '<option class="placeholder" value="">test</option>'
    );
  });

  it('renders one option for each element from the items array', () => {
    const items = ['item1', 'item2'];
    const select = shallow(<Select items={items} />);
    const options = select.find('option');
    expect(options.length).toEqual(2);
    options.forEach((o, idx) => {
      expect(o.text()).toEqual(items[idx]);
    });
  });

  it('renders options when the items are objects and not strings', () => {
    const items = [{ name: 'item1', value: 1 }, { name: 'item2', value: 2 }];
    const select = shallow(<Select items={items} />);
    const options = select.find('option');
    expect(options.length).toEqual(2);
    options.forEach((o, idx) => {
      const item = items[idx];
      expect(o.html()).toEqual(
        `<option value="${item.value}">${item.name}</option>`
      );
    });
  });

  it('renders options and the placeholder', () => {
    const items = ['item1', 'item2'];
    const select = shallow(<Select items={items} placeholder="test" />);
    const options = select.find('option');
    expect(options.length).toEqual(3);
    options.forEach((o, idx) => {
      if (idx === 0) {
        expect(o.html()).toEqual(
          `<option class="placeholder" value="">test</option>`
        );
      } else {
        const item = items[idx - 1];
        expect(o.html()).toEqual(`<option value="${item}">${item}</option>`);
      }
    });
  });

  it('renders sets form related attributes', () => {
    const select = mount(<Select id="select1" name="select2" />);
    const htmlSelect = select.find('select');
    expect(htmlSelect.length).toEqual(1);
    const node = htmlSelect.getDOMNode();
    expect(node.attributes.getNamedItem('id').value).toEqual('select1');
    expect(node.attributes.getNamedItem('name').value).toEqual('select2');
  });

  it('toggles the open class when the select is clicked', () => {
    const select = shallow(<Select items={['item1', 'item2']} />);
    const htmlSelect = select.find('select');
    htmlSelect.simulate('click');
    expect(select.hasClass('open')).toBeTruthy();
    htmlSelect.simulate('click');
    expect(select.hasClass('open')).toBeFalsy();
  });

  it('removes the open class when the select loses focus', () => {
    const select = shallow(<Select items={['item1', 'item2']} />);
    const htmlSelect = select.find('select');
    htmlSelect.simulate('click');
    expect(select.hasClass('open')).toBeTruthy();
    htmlSelect.simulate('blur');
    expect(select.hasClass('open')).toBeFalsy();
  });

  it('removes the open class when the select loses focus', () => {
    const select = shallow(<Select items={['item1', 'item2']} />);
    const htmlSelect = select.find('select');
    htmlSelect.simulate('click');
    expect(select.hasClass('open')).toBeTruthy();
    htmlSelect.simulate('blur');
    expect(select.hasClass('open')).toBeFalsy();
  });

  // Snapshot test
  it('matches the snapshot', () => {
    const props = {
      placeholder: 'placeholder',
      id: 'select',
      name: 'select',
      value: 'first option',
      items: ['first option', 'second option']
    };
    const events = {
      onChange: jest.fn()
    };
    const tree = renderer.create(<Select {...props} {...events} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
