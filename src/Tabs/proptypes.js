import PropTypes from 'prop-types';
import {ButtonsPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const TabsPropTypes = {
	...ButtonsPropTypes,
	activeTab: PROPTYPE.STRNUM,
	activeColorPreset: PROPTYPE.COLORS,
	buttonColorPreset: PROPTYPE.COLORS,
	activeColor: PropTypes.string,
	buttonColor: PropTypes.string,
	activeStyle: PropTypes.object,
	simple: PropTypes.bool,
	multiple: PropTypes.bool,
	optional: PropTypes.bool,
	dynamic: PropTypes.bool,
	noRemoving: PropTypes.bool,
	emptyTabName: PropTypes.string,
	onSelect: PropTypes.func,
	onAddTab: PropTypes.func,
	onRemoveTab: PropTypes.func
}