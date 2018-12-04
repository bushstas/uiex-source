import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const RoulettePropTypes = {
	...UIEXComponentPropTypes,
	value: PropTypes.any,
	direction: PROPTYPE.AXIS,	
	onChange: PropTypes.func,
	onDisabledClick: PropTypes.func
}