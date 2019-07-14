import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const ImageViewerTypes = {
	...UIEXComponentPropTypes,
	isOpen: PropTypes.bool,
	source: PropTypes.string,
	images: PropTypes.arrayOf(PropTypes.string),
	imageWidth: PROPTYPE.STRNUM,
	imageHeight: PROPTYPE.STRNUM,
	backgroundSize: PROPTYPE.BACKGROUND_SIZES,
	borderWidth: PROPTYPE.STRNUM,
	borderColor: PropTypes.string,
	borderRadius: PROPTYPE.STRNUM,
	borderOpacity: PROPTYPE.STRNUM,
	realImage: PropTypes.bool,
	imageIndex: PropTypes.number
}