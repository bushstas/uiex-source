import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const ImagePropTypes = {
	...UIEXComponentPropTypes,
	src: PropTypes.string.isRequired,
	width: PROPTYPE.STRNUM,
	height: PROPTYPE.STRNUM,
	margin: PROPTYPE.STRNUM,
	marginLeft: PROPTYPE.STRNUM,
	marginRight: PROPTYPE.STRNUM,
	marginTop: PROPTYPE.STRNUM,
	marginBottom: PROPTYPE.STRNUM,
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
	onClick: PropTypes.func
}