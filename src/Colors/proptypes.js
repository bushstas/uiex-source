import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const ColorsPropTypes = {
	...UIEXComponentPropTypes,
	value: PropTypes.string,
	columns: PROPTYPE.STRNUM,
	colors: PROPTYPE.STRING_ARRAY,
	colorHeight: PROPTYPE.STRNUM,
	margin: PROPTYPE.STRNUM,
	selectable: PropTypes.bool,
	round: PropTypes.bool,
	square: PropTypes.bool,
	withoutBorder: PropTypes.bool,
	onSelect: PropTypes.func,
	onDisabledClick: PropTypes.func
}

export const ColorPropTypes = {
	...UIEXComponentPropTypes,
	active: PropTypes.bool,
	value: PropTypes.string,
	onSelect: PropTypes.func
}