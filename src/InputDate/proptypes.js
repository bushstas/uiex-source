import PropTypes from 'prop-types';
import {InputPropTypes} from '../Input/proptypes';
import {PROPTYPE} from '../consts';

export const InputDatePropTypes = {
	...InputPropTypes,
	delimiter: PropTypes.string,
	yearFirst: PropTypes.bool,
	withTime: PropTypes.bool,
	minYear: PROPTYPE.STRNUM,
	maxYear: PROPTYPE.STRNUM,
	past: PropTypes.bool,
	future: PropTypes.bool,
	periodFrom: PropTypes.string,
	periodTo: PropTypes.string
}