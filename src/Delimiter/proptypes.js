import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const DelimiterPropTypes = {
	...UIEXComponentPropTypes,
	space: PROPTYPE.STRNUM,
	lineWidth: PROPTYPE.STRNUM,
	lineValign: PROPTYPE.VALIGN,
	lineThickness: PROPTYPE.STRNUM,
	lineColor: PropTypes.string,
	withGradient: PropTypes.bool,
	withLine: PropTypes.bool
}