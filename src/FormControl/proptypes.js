import PropTypes from 'prop-types';
import {CellPropTypes} from '../CellGroup/proptypes';
import {PROPTYPE} from '../consts';

export const FormControlPropTypes = {
	...CellPropTypes,
	caption: PROPTYPE.REACT_NODES,
	requiredError: PROPTYPE.REACT_NODES,
	lengthError: PROPTYPE.REACT_NODES,
	patternError: PROPTYPE.REACT_NODES,
	errorZIndex: PROPTYPE.STRNUM,
	errorBgColor: PropTypes.string,
	errorTextColor: PropTypes.string,
	validate: PropTypes.func,
	onChange: PropTypes.func
}