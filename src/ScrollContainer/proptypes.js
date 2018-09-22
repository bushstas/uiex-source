import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const ScrollContainerPropTypes = {
	...UIEXComponentPropTypes,
	scrollTop: PROPTYPE.STRNUM,
	transitionSpeed: PROPTYPE.STRNUM,
	scrollStep: PROPTYPE.STRNUM,
	scrollerWidth: PROPTYPE.STRNUM,
	outerPadding: PROPTYPE.STRNUM,
	innerPadding: PROPTYPE.STRNUM,
	overflowMaskColor: PropTypes.string,
	trackColor: PropTypes.string,
	sliderColor: PropTypes.string,
	noTransitionOnDrag: PropTypes.bool,
	hiddenScrollbar: PropTypes.bool,
	overlaidScrollbar: PropTypes.bool,
	withoutScrollbar: PropTypes.bool,
	scrollbarAtLeft: PropTypes.bool,
	transparentTrack: PropTypes.bool,
	onWheel: PropTypes.func.isRequired,
	onDisabledWheel: PropTypes.func
}