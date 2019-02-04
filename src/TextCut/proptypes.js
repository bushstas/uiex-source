import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const TextCutPropTypes = {
	...UIEXComponentPropTypes,
	lineHeight: PROPTYPE.STRNUM,
	maxLines: PROPTYPE.STRNUM,
	maxHeight: PROPTYPE.STRNUM,
	withEllipsis: PropTypes.bool,
	withEllipsisMask: PropTypes.bool,
	withBottomMask: PropTypes.bool,
	justified: PropTypes.bool,
	maskColor: PropTypes.string,
	maskHeight: PROPTYPE.STRNUM,
	maximizeButtonText: PropTypes.string,
	minimizeButtonText: PropTypes.string,
	noMinimize: PropTypes.bool,
	onExpand: PropTypes.func
}