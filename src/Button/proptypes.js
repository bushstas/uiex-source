import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const ButtonPropTypes = {
	...UIEXComponentPropTypes,
	href: PropTypes.string,
	target: PropTypes.string,
	value: PropTypes.any,
	colorPreset: PROPTYPE.COLORS,
	color: PropTypes.string,
	gradient: PropTypes.bool,
	onClick: PropTypes.func,
	onDisabledClick: PropTypes.func
}