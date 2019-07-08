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
	validating: PropTypes.bool,
	errorsShown: PropTypes.bool,
	captionStyle: PROPTYPE.STYLE,
	sectionStyle: PROPTYPE.STYLE,
	sectionCaptionStyle: PROPTYPE.STYLE,
	requiredError: PROPTYPE.REACT_NODES,
	lengthError: PROPTYPE.REACT_NODES,
	patternError: PROPTYPE.REACT_NODES,
	errorZIndex: PROPTYPE.STRNUM,
	onChange: PropTypes.func,
	onDataChange: PropTypes.func,
	onChangeValidity: PropTypes.func,
	onSubmit: PropTypes.func,
	onSubmitFail: PropTypes.func,
	onReset: PropTypes.func,
	onClear: PropTypes.func
}