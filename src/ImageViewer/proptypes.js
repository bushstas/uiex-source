import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const ImageViewerTypes = {
	...UIEXComponentPropTypes,
	isOpen: PropTypes.bool,
	source: PropTypes.string,
	images: PropTypes.arrayOf(PropTypes.string),
	imageIndex: PropTypes.number,
	contentWidth: PROPTYPE.STRNUM,
	animated: PropTypes.bool,
	looping: PropTypes.bool
}