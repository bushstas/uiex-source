import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const DatePickerPropTypes = {
	...UIEXComponentPropTypes,
	value: PROPTYPE.STRNUM,
	day: PROPTYPE.STRNUM,
	month: PROPTYPE.STRNUM,
	year: PROPTYPE.STRNUM,
	dayNames: PROPTYPE.STRING_ARRAY,
	monthNames: PROPTYPE.STRING_ARRAY,
	yearFirst: PropTypes.bool,
	fromSunday: PropTypes.bool,
	markedDays: PROPTYPE.NUMBER_ARRAY,
	markedDaysDisabled: PropTypes.bool,
	onChange: PropTypes.func,
	onPickDay: PropTypes.func,
	onPickMonth: PropTypes.func,
	onPickYear: PropTypes.func
}