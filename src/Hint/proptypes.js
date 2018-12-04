import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const HintPropTypes = {
	...UIEXComponentPropTypes,
	target: PropTypes.object,
	position: PROPTYPE.TOOLTIP_POSITIONS,
	transparency: PROPTYPE.STRNUM,
	colorTheme: PROPTYPE.COLORS,
	bgColor: PropTypes.string,
	textColor: PropTypes.string,
	border: PropTypes.string,
	boxShadow: PropTypes.string,
	animation: PROPTYPE.MODAL_ANIMATION,
	isOpen: PropTypes.bool,
	isFrozen: PropTypes.bool,
	nowrap: PropTypes.bool,
	withArrow: PropTypes.bool,
	withMouseEventHandlers: PropTypes.bool,
	popupStyle: PropTypes.object,
	onToggleShown: PropTypes.func
}