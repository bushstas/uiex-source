import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const SpinnerPropTypes = {
	...UIEXComponentPropTypes,
	type: PROPTYPE.SPINNER_TYPES
}