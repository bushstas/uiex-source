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
	datePicker: PropTypes.node,
	delimiter: PropTypes.string,
	minYear: PROPTYPE.STRNUM,
	maxYear: PROPTYPE.STRNUM,
	periodFrom: PropTypes.string,
	periodTo: PropTypes.string,
	onPick: PropTypes.func,
	onInput: PropTypes.func,
	onShowPicker: PropTypes.func
}