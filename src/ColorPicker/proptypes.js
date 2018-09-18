import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const ColorPickerPropTypes = {
	...UIEXComponentPropTypes,
	value: PropTypes.string,
	withoutInput: PropTypes.bool,
	presetColors: PropTypes.arrayOf(PropTypes.string),
	onChange: PropTypes.func,
	onChangeHue: PropTypes.func,
	onSelectPreset: PropTypes.func
}