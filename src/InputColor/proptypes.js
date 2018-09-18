import PropTypes from 'prop-types';
import {InputPropTypes} from '../Input/proptypes';
import {PROPTYPE} from '../consts';

export const InputColorPropTypes = {
	...InputPropTypes,
	withoutPicker: PropTypes.bool,
	withoutHash: PropTypes.bool,
	fullWidthPicker: PropTypes.bool,
	pickerShown: PropTypes.bool,
	pickerOnTop: PropTypes.bool,
	presetColors: PROPTYPE.STRING_ARRAY,
	onChangePicker: PropTypes.func,
	onInput: PropTypes.func
}