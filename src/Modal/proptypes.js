import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const ModalPropTypes = {
	...UIEXComponentPropTypes,
	header: PROPTYPE.REACT_NODES,
	footer: PROPTYPE.REACT_NODES,
	outerContent: PROPTYPE.REACT_NODES,
	isOpen: PropTypes.bool,
	draggable: PropTypes.bool,
	dragWithinWindow: PropTypes.bool,
	expanded: PropTypes.bool,
	expandable: PropTypes.bool,
	unclosable: PropTypes.bool,
	withoutMask: PropTypes.bool,
	withoutPortal: PropTypes.bool,
	noMaskClose: PropTypes.bool,
	maskOpacity: PROPTYPE.STRNUM,
	maskColor: PropTypes.string,
	animation: PROPTYPE.MODAL_ANIMATION,
	blurSelector: PropTypes.string,
	blurValue: PROPTYPE.STRNUM,
	withoutPadding: PropTypes.bool,
	onClose: PropTypes.func,
	onExpand: PropTypes.func,
	onDragStart: PropTypes.func,
	onDrag: PropTypes.func,
	onDragEnd: PropTypes.func
}