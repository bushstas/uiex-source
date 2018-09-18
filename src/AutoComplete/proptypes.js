import PropTypes from 'prop-types';
import {SelectPropTypes} from '../Select/proptypes';
import {PROPTYPE} from '../consts';

export const AutoCompletePropTypes = {
	...SelectPropTypes,
	dynamic: PropTypes.bool,
	focused: PropTypes.bool,
	withoutIcon: PropTypes.bool,
	passive: PropTypes.bool,
	onInput: PropTypes.func,
	onSelect: PropTypes.func,
	onPick: PropTypes.func,
	onEnter: PropTypes.func
}