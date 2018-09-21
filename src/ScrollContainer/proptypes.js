import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const ScrollContainerPropTypes = {
	...UIEXComponentPropTypes,
	scrollTop: PROPTYPE.STRNUM,
	onWheel: PropTypes.func,
	onDisabledWheel: PropTypes.func
}