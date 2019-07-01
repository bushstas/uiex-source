import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const FormPropTypes = {
	...UIEXComponentPropTypes,
	name: PropTypes.string,
	caption: PROPTYPE.REACT_NODES,
	columns: PROPTYPE.STRNUM,
	cellSize: PROPTYPE.STRNUM,
	rowMargin: PROPTYPE.STRNUM,
	data: PropTypes.object,
	initialData: PropTypes.object,
	defaultData: PropTypes.object,
	onChange: PropTypes.func,
	onSubmit: PropTypes.func,
	onReset: PropTypes.func,
	onClear: PropTypes.func
}