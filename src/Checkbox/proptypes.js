import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const VALUE_PROPTYPE = PropTypes.oneOfType([
	PropTypes.string,
	PropTypes.number,
	PropTypes.bool,
	PropTypes.array
]);

export const CheckboxPropTypes = {
	...UIEXComponentPropTypes,
	name: PROPTYPE.STRNUM,
	value: VALUE_PROPTYPE,
	label: PROPTYPE.STRNUM,
	icon: PROPTYPE.STRBOOL,
	iconType: PROPTYPE.ICON_TYPES,
	multiline: PropTypes.bool,
	readOnly: PropTypes.bool,
	controlStyle: PropTypes.object,
	markerStyle: PropTypes.object,
	labelStyle: PropTypes.object,
	onChange: PropTypes.func,
	onDisabledClick: PropTypes.func
}