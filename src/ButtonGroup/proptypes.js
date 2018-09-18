import PropTypes from 'prop-types';
import {ButtonsPropTypes} from '../UIEXComponentPropTypes';

export const ButtonGroupPropTypes = {
	...ButtonsPropTypes,
	onClick: PropTypes.func
}