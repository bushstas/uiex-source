import PropTypes from 'prop-types';
import {UIEXComponentPropTypes, UIEXAnimatedPropTypes} from '../UIEXComponentPropTypes';

export const BoxContainerPropTypes = {
	...UIEXComponentPropTypes,
	...UIEXAnimatedPropTypes,
	isOpen: PropTypes.bool,
	noHideAnimation: PropTypes.bool,
	onToggle: PropTypes.func,
	onDisabledClick: PropTypes.func
}

export const BoxPropTypes = {
	...BoxContainerPropTypes,	
	button: PropTypes.string,
	buttonUnder: PropTypes.bool	
}