import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const RadioPropTypes = {
	...UIEXComponentPropTypes,
	name: PROPTYPE.STRNUM,
	value: PropTypes.bool,
	label: PROPTYPE.STRNUM,
	multiline: PropTypes.bool,
	controlStyle: PropTypes.object,
	labelStyle: PropTypes.object,
	onChange: PropTypes.func,
	onDisabledClick: PropTypes.func
}