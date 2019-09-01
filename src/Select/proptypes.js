import PropTypes from 'prop-types';
import {BoxContainerPropTypes} from '../Box/proptypes';
import {PROPTYPE} from '../consts';

export const SelectPropTypes = {
	...BoxContainerPropTypes,
	name: PropTypes.string,
	value: PROPTYPE.SELECT_VALUE,
	optionAsValue: PropTypes.bool,
	options: PROPTYPE.OPTIONS,
	placeholder: PropTypes.string,
	pendingPlaceholder: PropTypes.string,
	empty: PROPTYPE.STRBOOL,
	optionsShown: PropTypes.bool,
	multiple: PropTypes.bool,
	readOnly: PropTypes.bool,
	iconType: PROPTYPE.ICON_TYPES,
	menuStyle: PropTypes.object,
	optionStyle: PropTypes.object,
	onChange: PropTypes.func,
	onSelect: PropTypes.func,
	onSelectOption: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	onDisabledClick: PropTypes.func,
	onPromiseResolve: PropTypes.func,
	onPromiseReject: PropTypes.func
}