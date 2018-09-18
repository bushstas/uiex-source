import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const LabelPropTypes = {
	...UIEXComponentPropTypes,
	value: PropTypes.any,
	color: PROPTYPE.COLORS,
	removable: PropTypes.bool,
	gradient: PropTypes.bool,
	onClick: PropTypes.func,
	onRemove: PropTypes.func,
	onDisabledClick: PropTypes.func
}