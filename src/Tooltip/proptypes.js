import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const TooltipPropTypes = {
	...UIEXComponentPropTypes,
	text: PropTypes.string,
	size: PropTypes.number
}