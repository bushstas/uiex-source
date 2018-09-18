import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const InputBooleanPropTypes = {
	...UIEXComponentPropTypes,
	name: PropTypes.string,
	value: PropTypes.bool,
	defaultValue: PropTypes.bool,
	icon: PROPTYPE.STRBOOL,
	iconType: PROPTYPE.ICON_TYPES,
	onChange: PropTypes.func,
	onDisabledClick: PropTypes.func
}