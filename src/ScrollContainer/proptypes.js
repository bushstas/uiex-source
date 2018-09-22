import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const ScrollContainerPropTypes = {
	...UIEXComponentPropTypes,
	scrollTop: PROPTYPE.STRNUM,
	transitionSpeed: PROPTYPE.STRNUM,
	scrollStep: PROPTYPE.STRNUM,
	noTransitionOnDrag: PropTypes.bool,
	onWheel: PropTypes.func.isRequired,
	onDisabledWheel: PropTypes.func
}