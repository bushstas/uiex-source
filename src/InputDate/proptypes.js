import PropTypes from 'prop-types';
import {InputPropTypes} from '../Input/proptypes';
import {PROPTYPE} from '../consts';

export const InputDatePropTypes = {
	...InputPropTypes,
	initialValue: PropTypes.string,
	yearFirst: PropTypes.bool,
	past: PropTypes.bool,
	future: PropTypes.bool,
	withoutIcon: PropTypes.bool,
	isTimestamp: PropTypes.bool,
	inSeconds: PropTypes.bool,
	withTime: PropTypes.bool,
	withPicker: PropTypes.bool,
	delimiter: PropTypes.string,
	minYear: PROPTYPE.STRNUM,
	maxYear: PROPTYPE.STRNUM,
	periodFrom: PropTypes.string,
	periodTo: PropTypes.string,
	pickerFromSunday: PropTypes.bool,
	pickerYearFirst: PropTypes.bool,
	pickerDayNames: PROPTYPE.STRING_ARRAY,
	pickerMonthNames: PROPTYPE.STRING_ARRAY
}