import PropTypes from 'prop-types';
import {InputPropTypes} from '../Input/proptypes';
import {PROPTYPE} from '../consts';

export const InputArrayPropTypes = {
	value: PropTypes.any,
	withoutInput: PropTypes.bool,
	inputUnder: PropTypes.bool,
	rightClickRemove: PropTypes.bool,
	doubleClickEdit: PropTypes.bool,
	uniqueItems: PropTypes.bool,
	autoDefine: PropTypes.bool,
	colorTypes: PropTypes.bool,
	onlyType: PROPTYPE.ARRAY_INPUT_TYPE,
	allowedTypes: PROPTYPE.ARRAY_INPUT_TYPES,
	exceptTypes: PROPTYPE.ARRAY_INPUT_TYPES,
	maxItems: PROPTYPE.STRNUM,
	delimiter: PropTypes.string,
	withControls: PropTypes.bool,
	placeholder: PropTypes.string,
	inputTextEventTimeout: PROPTYPE.STRNUM,
	addToBeginning: PropTypes.bool,
	autoCompleteOptions: PROPTYPE.OPTIONS,
	onChange: PropTypes.func,
	onAddItem: PropTypes.func,
	onRemoveItem: PropTypes.func,
	onInputText: PropTypes.func
}