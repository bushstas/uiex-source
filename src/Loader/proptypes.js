import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const LoaderPropTypes = {
	...UIEXComponentPropTypes,
	loadingText: PropTypes.string,
	maskColor: PropTypes.string,
	maskOpacity: PROPTYPE.STRNUM,
	overlayed: PropTypes.bool,
	loading: PropTypes.bool,
	withoutMask: PropTypes.bool,
	spinnerType: PROPTYPE.SPINNER_TYPES,
	maskStyle: PROPTYPE.STYLE
}