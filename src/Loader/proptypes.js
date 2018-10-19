import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const LoaderPropTypes = {
	...UIEXComponentPropTypes,
	overlayed: PropTypes.bool,
	loading: PropTypes.bool
}