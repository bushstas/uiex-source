import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const BoxCommonPropTypes = {
	animation: PROPTYPE.ANIM_TYPE,
	speed: PROPTYPE.ANIM_SPEED,
	effect: PROPTYPE.ANIM_EFFECTS
}

export const BoxContainerPropTypes = {
	...UIEXComponentPropTypes,
	...BoxCommonPropTypes
}

export const BoxPropTypes = {
	...BoxContainerPropTypes,
	isOpen: PropTypes.bool,	
	button: PropTypes.string,
	buttonUnder: PropTypes.bool,
	noHideAnimation: PropTypes.bool,
	onToggle: PropTypes.func,
	onDisabledClick: PropTypes.func
}