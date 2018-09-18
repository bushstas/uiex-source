import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const DraggablePropTypes = {
	...UIEXComponentPropTypes,
	name: PropTypes.string,
	areaWidth: PROPTYPE.STRNUM,
	areaHeight: PROPTYPE.STRNUM,
	x: PROPTYPE.STRNUM,
	y: PROPTYPE.STRNUM,
	z: PROPTYPE.STRNUM,
	dragLimits: PROPTYPE.DRAG_LIMITS,
	horizontal: PropTypes.bool,
	vertical: PropTypes.bool,
	fixed: PropTypes.bool,
	onDragStart: PropTypes.func,
	onDrag: PropTypes.func.isRequired,
	onDragEnd: PropTypes.func
}