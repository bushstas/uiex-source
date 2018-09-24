import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const ArrowPropTypes = {
	...UIEXComponentPropTypes,
	value: PropTypes.any,
	direction: PROPTYPE.DIRECTIONS,
	size: PROPTYPE.STRNUM,
	lengthRatio: PROPTYPE.STRNUM,
	thickness: PROPTYPE.STRNUM,
	figuredDepth: PROPTYPE.STRNUM,
	clipped: PropTypes.bool,
	figured: PropTypes.bool,
	color: PROPTYPE.COLORS,
	onClick: PropTypes.func,
	onDisabledClick: PropTypes.func
}