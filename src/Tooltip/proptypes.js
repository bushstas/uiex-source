import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const TooltipPropTypes = {
	...UIEXComponentPropTypes,
	type: PROPTYPE.TOOLTIP_TYPES,
	position: PROPTYPE.TOOLTIP_POSITIONS,
	size: PROPTYPE.STRNUM,
	text: PropTypes.string,
	transparency: PROPTYPE.STRNUM,
	delay: PROPTYPE.STRNUM,
	popupWidth: PROPTYPE.STRNUM,
	popupBorder: PropTypes.string,
	popupShadow: PropTypes.string,
	textColor: PropTypes.string,
	popupColorTheme: PROPTYPE.COLORS,
	popupColor: PropTypes.string,
	animation: PROPTYPE.MODAL_ANIMATION,
	popupShown: PropTypes.bool,
	popupFrozen: PropTypes.bool,
	nowrap: PropTypes.bool,
	withArrow: PropTypes.bool,
	popupStyle: PropTypes.object
}