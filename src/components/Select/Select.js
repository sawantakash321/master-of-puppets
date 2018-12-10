import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Select extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.onToggle = this.onToggle.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onToggle() {
    this.setState(({ isOpen, ...otherState }) => {
      return {
        ...otherState,
        isOpen: !isOpen
      };
    });
  }

  onBlur() {
    this.setState(prevState => {
      return {
        ...prevState,
        isOpen: false
      };
    });
  }

  render() {
    const {
      placeholder = '',
      items = [],
      onChange,
      value,
      id,
      name
    } = this.props;
    const { isOpen } = this.state;

    // Compose the items by converting strings or objects into option elements
    const options = items.map(i => {
      if (typeof i === 'string') {
        return (
          <option key={i} value={i}>
            {i}
          </option>
        );
      }

      return (
        <option key={i.value} value={i.value}>
          {i.name}
        </option>
      );
    });

    return (
      <div className={classNames({ select: true, open: isOpen })}>
        <select
          onClick={this.onToggle}
          value={value}
          id={id}
          name={name}
          onBlur={this.onBlur}
          onChange={onChange}
        >
          {placeholder && (
            <option className="placeholder" value="">
              {placeholder}
            </option>
          )}
          {options}
        </select>
      </div>
    );
  }
}

Select.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  items: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func
};

export default Select;
