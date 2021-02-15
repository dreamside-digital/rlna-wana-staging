import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select';
import timezones from '../../utils/timezone-names.js';

export default class TimeZoneSelect extends Component {
  componentDidMount() {
    if (!this.props.value) {
      this.detectTimeZone()
    }
  }

  onChange = (selected) => {
    const timezone = !!selected ? selected.value : null;
    this.props.handleChange(timezone);
  }

  detectTimeZone = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.props.handleChange(timezone)
  }


  render() {
    const { label, name, id, value, required, disabled, errorMessage, helpText, classes, selectClasses, isClearable, isMulti, ...rest } = this.props
    const timezoneOptions = timezones.map((tz) => ({value: tz, label: tz }))
    const selected = timezoneOptions.find(opt => opt.value === value) || null;

    return(
      <Select
        name={ name }
        id={ name }
        className={ `form-group input-with-label ${selectClasses}` }
        value={ selected }
        onChange={ this.onChange }
        options={timezoneOptions}
        isClearable={ isClearable }
        isMulti={ isMulti }
        isDisabled={ disabled }
        classNamePrefix={'timezone-select'}
        theme={theme => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: '#00A6CE',
            primary75: '#3a3838',
            primary50: '#c1bfbf',
            primary25: '#d6d5d4'
          },
        })}
        {...rest}
      />
    )
  }
}

TimeZoneSelect.propTypes = {
  handleChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  classes: PropTypes.string,
  selectClasses: PropTypes.string,
  timezone: PropTypes.string,
  latitude: PropTypes.string,
  longitude: PropTypes.string,
  errorMessage: PropTypes.string,
  isClearable: PropTypes.bool,
  isMulti: PropTypes.bool,
}

TimeZoneSelect.defaultProps = {
  classes: "",
  selectClasses: "",
  handleChange: (selected) => console.log("Implement a function to save selection", selected),
  isClearable: false,
  isMulti: false,
  timezone: "America/Toronto"
}
