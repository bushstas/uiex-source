import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

const COORD = PropTypes.oneOfType([
	PROPTYPE.STRNUM,
	PropTypes.object
]);

export const PopupPropTypes = {
	...UIEXComponentPropTypes,
	target: PropTypes.object,
	role: PROPTYPE.POPUP_ROLES,
	isOpen: PropTypes.bool,
	queueName: PropTypes.string,
	inPortal: PropTypes.bool,
	x: COORD,
	y: COORD,
	zIndex: PROPTYPE.STRNUM,
	onCollapse: PropTypes.func
};