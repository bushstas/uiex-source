import PropTypes from 'prop-types';
import {BoxContainerPropTypes} from '../Box/proptypes';
import {PROPTYPE} from '../consts';

export const SelectPropTypes = {
	...BoxContainerPropTypes,
	name: PropTypes.string,
	value: PROPTYPE.STRNUMS,
	selectedIndex: PROPTYPE.STRNUM,
	options: PROPTYPE.OPTIONS,
	placeholder: PropTypes.string,
	pendingPlaceholder: PropTypes.string,
	empty: PROPTYPE.STRBOOL,
	optionsShown: PropTypes.bool,
	multiple: PropTypes.bool,
	readOnly: PropTypes.bool,
	iconType: PROPTYPE.ICON_TYPES,
	onChange: PropTypes.func,
	onSelect: PropTypes.func,
	onSelectOption: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	onDisabledClick: PropTypes.func,
	onPromiseResolve: PropTypes.func,
	onPromiseReject: PropTypes.func
}