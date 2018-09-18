import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const CheckboxGroupPropTypes = {
	...UIEXComponentPropTypes,
	name: PropTypes.string,
	value: PROPTYPE.CHECKBOX_GROUP_VALUE,
	options: PROPTYPE.OPTIONS,
	mapped: PropTypes.bool,
	maxHeight: PROPTYPE.STRNUM,
	multiline: PropTypes.bool,
	checkAll: PROPTYPE.STRBOOL,
	columns: PROPTYPE.STRNUM,
	noBorder: PropTypes.bool,
	radioMode: PropTypes.bool,
	onChange: PropTypes.func,
	onDisabledClick: PropTypes.func
}