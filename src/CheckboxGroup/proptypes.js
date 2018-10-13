import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';
import {VALUE_PROPTYPE} from '../Checkbox/proptypes';

export const CheckboxGroupPropTypes = {
	...UIEXComponentPropTypes,
	name: PropTypes.string,
	value: VALUE_PROPTYPE,
	options: PROPTYPE.OPTIONS,
	maxHeight: PROPTYPE.STRNUM,
	multiline: PropTypes.bool,
	checkAll: PROPTYPE.STRBOOL,
	columns: PROPTYPE.STRNUM,
	noBorder: PropTypes.bool,
	radioMode: PropTypes.bool,
	contentStyle: PropTypes.object,
	onChange: PropTypes.func,
	onDisabledClick: PropTypes.func
}