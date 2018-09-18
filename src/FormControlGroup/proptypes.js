import PropTypes from 'prop-types';
import {CellGroupPropTypes} from '../CellGroup/proptypes';

export const FormControlGroupPropTypes = {
	...CellGroupPropTypes,
	onChange: PropTypes.func
}