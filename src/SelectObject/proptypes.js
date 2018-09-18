import PropTypes from 'prop-types';
import {BoxContainerPropTypes} from '../Box/proptypes';
import {PROPTYPE} from '../consts';

export const SelectObjectPropTypes = {
	name: PropTypes.string,
	value: PropTypes.any,
	options: PropTypes.array,
	placeholder: PropTypes.string,
	empty: PropTypes.bool,
	onChange: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	onDisabledClick: PropTypes.func
}