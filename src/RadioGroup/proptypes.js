import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const RadioGroupPropTypes = {
	...UIEXComponentPropTypes,
	name: PropTypes.string,
	value: PROPTYPE.STRNUM,
	options: PROPTYPE.STRARR,
	maxHeight: PROPTYPE.STRNUM,
	multiline: PropTypes.bool,
	columns: PROPTYPE.STRNUM,
	noBorder: PropTypes.bool,
	firstChecked: PropTypes.bool,
	onChange: PropTypes.func,
	onDisabledClick: PropTypes.func
}