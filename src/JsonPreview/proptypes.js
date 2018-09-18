import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const JsonPreviewPropTypes = {
	...UIEXComponentPropTypes,
	data: PropTypes.any
}