import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const TimeScalePropTypes = {
	...UIEXComponentPropTypes,
	value: PROPTYPE.STRNUM,
	minValue: PROPTYPE.STRNUM,
	maxValue: PROPTYPE.STRNUM,
	onChange: PropTypes.func
}