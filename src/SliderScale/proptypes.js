import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const SliderScalePropTypes = {
	...UIEXComponentPropTypes,
	value: PROPTYPE.STRNUM,
	minValue: PROPTYPE.STRNUM,
	maxValue: PROPTYPE.STRNUM,
	segments: PROPTYPE.STRNUM,
	values: PROPTYPE.STRARR,
	exactValue: PropTypes.bool,
	withoutScale: PropTypes.bool,
	shownValues: PROPTYPE.STRNUM,
	onChange: PropTypes.func
}