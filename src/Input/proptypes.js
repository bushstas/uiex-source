import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const InputPropTypes = {
	...UIEXComponentPropTypes,
	type: PropTypes.string,
	name: PropTypes.string,
	value: PROPTYPE.STRNUM,
	placeholder: PropTypes.string,
	readOnly: PropTypes.bool,
	textarea: PropTypes.bool,
	clearable: PropTypes.bool,
	valid: PropTypes.bool,
	withIndicator: PropTypes.bool,
	focusStyle: PropTypes.object,
	clearButtonStyle: PropTypes.object,
	customFilter: PropTypes.func,
	pattern: PropTypes.oneOfType([
		PROPTYPE.STRREGEXP, PropTypes.func
	]),
	required: PropTypes.bool,
	minLength: PROPTYPE.STRNUM,
	maxLength: PROPTYPE.STRNUM,
	defaultValue: PROPTYPE.STRNUM,
	onChangeValidity: PropTypes.func,
	onChange: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	onEnter: PropTypes.func,
	onClear: PropTypes.func,
	onDisabledClick: PropTypes.func
}