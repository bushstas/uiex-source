import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const TouchablePropTypes = {
	...UIEXComponentPropTypes,
	minEffort: PROPTYPE.STRNUM,
	onMoveLeft: PropTypes.func,
	onMoveRight: PropTypes.func,
	onMoveUp: PropTypes.func,
	onMoveDown: PropTypes.func
}