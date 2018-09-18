import PropTypes from 'prop-types';
import {InputPropTypes} from '../Input/proptypes';
import {PROPTYPE} from '../consts';

export const InputPhonePropTypes = {
	...InputPropTypes,
	mask: PropTypes.string.isRequired,
	code: PROPTYPE.STRNUM,
	numericCode: PROPTYPE.STRNUM,
	numeric: PropTypes.bool,
	withCode: PropTypes.bool
}