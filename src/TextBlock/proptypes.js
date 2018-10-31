import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const TextBlockPropTypes = {
	...UIEXComponentPropTypes,
	fontSize: PROPTYPE.STRNUM,
	lineHeight: PROPTYPE.STRNUM,
	textColor: PropTypes.string,
	bgColor: PropTypes.string,
	padding: PROPTYPE.STRNUM,
	margin: PROPTYPE.STRNUM,
	border: PropTypes.string,
	borderRadius: PROPTYPE.STRNUM,
	boxShadow: PropTypes.string,
	textShadow: PropTypes.string,
	transparency: PROPTYPE.STRNUM,
	maxLines: PROPTYPE.STRNUM,
	bold: PropTypes.bool,
	italic: PropTypes.bool,
	noselect: PropTypes.bool,
	justify: PropTypes.bool,
	nowrap: PropTypes.bool,
	withEllipsis: PropTypes.bool
}