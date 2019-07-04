import PropTypes from 'prop-types';
import {CellGroupPropTypes} from '../CellGroup/proptypes';
import {PROPTYPE} from '../consts';

export const FormSectionPropTypes = {
	...CellGroupPropTypes,
	name: PropTypes.string,
	caption: PROPTYPE.REACT_NODES,
	onChange: PropTypes.func
}