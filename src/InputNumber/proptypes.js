import PropTypes from 'prop-types';
import {InputPropTypes} from '../Input/proptypes';
import {PROPTYPE} from '../consts';

export const InputNumberPropTypes = {
	...InputPropTypes,
	positive: PropTypes.bool,
	negative: PropTypes.bool,
	decimal: PropTypes.bool,
	correctionOnBlur: PropTypes.bool,
	valueWithMeasure: PropTypes.bool,
	withoutControls: PropTypes.bool,
	toFixed: PROPTYPE.STRNUM,
	addStep: PROPTYPE.STRNUM,
	minValue: PROPTYPE.STRNUM,
	maxValue: PROPTYPE.STRNUM,
	measure: PropTypes.string,
	measures: PROPTYPE.INPUT_MEASURES,
	onChangeMeasure: PropTypes.func
}