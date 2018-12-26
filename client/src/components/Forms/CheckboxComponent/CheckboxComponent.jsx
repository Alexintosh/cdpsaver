import React from 'react';
import PropTypes from 'prop-types';

import './CheckboxComponent.scss';

const CheckboxComponent = ({
  input, wrapperClassName, inputClassName,
  id, labelText, meta: { touched, error }, focus,
}) => (
  <div className={`${wrapperClassName} ${touched && error ? 'wrapper-error' : ''}`}>
    <input
      {...input}
      id={id || ''}
      className={`${inputClassName}`}
      type="checkbox"
      autoFocus={focus}
    />
    <label htmlFor={id || ''} className="label-wrapper">
      <div className="checkbox-wrapper">
        <div className="box" />
      </div>

      <div className="label-text">
        {labelText}
      </div>
    </label>
  </div>
);

CheckboxComponent.defaultProps = {
  labelText: '',
  id: '',
  focus: false,
  wrapperClassName: 'form-item-wrapper checkbox',
  inputClassName: 'form-item',
};

CheckboxComponent.propTypes = {
  input: PropTypes.any.isRequired,
  wrapperClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  id: PropTypes.string,
  labelText: PropTypes.string,
  meta: PropTypes.object.isRequired,
  focus: PropTypes.bool,
};

export default CheckboxComponent;
