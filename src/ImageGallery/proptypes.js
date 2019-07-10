import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const ImageGalleryPropTypes = {
	...UIEXComponentPropTypes,
	behavior: PROPTYPE.GALLERY_BEHAVIORS,
	source: PropTypes.string,
	images: PropTypes.arrayOf(PropTypes.string)
}