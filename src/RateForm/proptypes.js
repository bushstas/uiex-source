import PropTypes from 'prop-types';
import {UIEXFormPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const RateFormPropTypes = {
	...UIEXFormPropTypes,
	scale: PROPTYPE.STRNUM,
	iconType: PROPTYPE.ICON_TYPES,
	icon: PropTypes.string,
	activeIcon: PropTypes.string,
	normalColor: PropTypes.string,
	activeColor: PropTypes.string,
	hoverColor: PropTypes.string,	
	submit: PROPTYPE.STRBOOL,
	reset: PROPTYPE.STRBOOL,
	resettable: PropTypes.bool,	
	onReset: PropTypes.func
}