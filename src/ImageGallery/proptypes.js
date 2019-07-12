import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const ImageGalleryPropTypes = {
	...UIEXComponentPropTypes,
	behavior: PROPTYPE.GALLERY_BEHAVIORS,
	source: PropTypes.string,
	images: PropTypes.arrayOf(PropTypes.string),
	imageWidth: PROPTYPE.STRNUM,
	imageHeight: PROPTYPE.STRNUM,
	imageMargin: PROPTYPE.STRNUM,
	reflectionHeight: PROPTYPE.STRNUM,
	reflectionMargin: PROPTYPE.STRNUM,
	reflectionOpacity: PROPTYPE.STRNUM,
	reflectionMaskColor: PropTypes.string,
	backgroundSize: PROPTYPE.BACKGROUND_SIZES,
	backgroundRepeat: PROPTYPE.BACKGROUND_REPEATS,
	borderWidth: PROPTYPE.STRNUM,
	borderColor: PropTypes.string,
	borderRadius: PROPTYPE.STRNUM,
	borderOpacity: PROPTYPE.STRNUM,
	hoverBorderWidth: PROPTYPE.STRNUM,
	hoverBorderColor: PropTypes.string,
	hoverBorderOpacity: PROPTYPE.STRNUM,
	reflected: PropTypes.bool,
	realImage: PropTypes.bool,
	onView: PropTypes.func
}