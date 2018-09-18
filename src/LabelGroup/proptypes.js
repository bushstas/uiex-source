import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const LabelGroupPropTypes = {
	...UIEXComponentPropTypes,
	labelColor: PROPTYPE.COLORS,
	labelWidth: PROPTYPE.STRNUM,
	labelHeight: PROPTYPE.STRNUM,
	labelStyle: PropTypes.object,
	removable: PropTypes.bool,
	gradient: PropTypes.bool,
	onClickLabel: PropTypes.func,
	onRemoveLabel: PropTypes.func,
	onDisabledClick: PropTypes.func
}