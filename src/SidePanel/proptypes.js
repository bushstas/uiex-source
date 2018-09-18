import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const SidePanelPropTypes = {
	...UIEXComponentPropTypes,
	side: PROPTYPE.SIDES,	
	isOpen: PropTypes.bool,
	animation: PROPTYPE.PANEL_ANIMATION,
	speed: PROPTYPE.ANIM_SPEED,
	effect: PROPTYPE.ANIM_EFFECTS,
	unclosable: PropTypes.bool,
	onClose: PropTypes.func
}