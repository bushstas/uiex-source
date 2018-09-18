import PropTypes from 'prop-types';
import {ButtonsPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const TabsPropTypes = {
	...ButtonsPropTypes,
	activeTab: PROPTYPE.STRNUM,
	activeColor: PROPTYPE.COLORS,
	buttonColor: PROPTYPE.COLORS,
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