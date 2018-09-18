import PropTypes from 'prop-types';
import {InputPropTypes} from '../Input/proptypes';
import {PROPTYPE} from '../consts';

export const InputRegexpPropTypes = {
	...InputPropTypes,
	value: PROPTYPE.STRREGEXP,
	defaultValue: PROPTYPE.STRREGEXP,
	stringified: PropTypes.bool
}