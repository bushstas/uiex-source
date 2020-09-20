import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const ScrollContainerPropTypes = {
	...UIEXComponentPropTypes,
	scrollTop: PROPTYPE.STRNUM,
	transitionSpeed: PROPTYPE.STRNUM,
	scrollStep: PROPTYPE.STRNUM,
	trackWidth: PROPTYPE.STRNUM,
	sliderWidth: PROPTYPE.STRNUM,
	trackWidth: PROPTYPE.STRNUM,
	outerPadding: PROPTYPE.STRNUM,
	innerPadding: PROPTYPE.STRNUM,
	scrollbarRadius: PROPTYPE.STRNUM,
	overflowMaskHeight: PROPTYPE.STRNUM,
	overflowMaskColor: PropTypes.string,
	trackColor: PropTypes.string,
	sliderColor: PropTypes.string,
	noTransitionOnDrag: PropTypes.bool,
	hiddenScrollbar: PropTypes.bool,
	overlaidScrollbar: PropTypes.bool,
	withoutScrollbar: PropTypes.bool,
	scrollbarAtLeft: PropTypes.bool,
	transparentTrack: PropTypes.bool,
	transitionEffect: PROPTYPE.ANIM_EFFECTS,
	indicateScrollTop: PropTypes.bool,
	onWheel: PropTypes.func,
	onDisabledWheel: PropTypes.func
}