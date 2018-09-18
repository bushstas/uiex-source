import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const FormControlPropTypes = {
	...UIEXComponentPropTypes,
	caption: PROPTYPE.REACT_NODES,
	size: PROPTYPE.STRNUM,
	shift: PROPTYPE.STRNUM,
	onChange: PropTypes.func
}