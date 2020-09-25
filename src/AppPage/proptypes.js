import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const AppPagePropTypes = {
	...UIEXComponentPropTypes,
	name: PropTypes.string,
	path: PropTypes.string,
	props: PropTypes.object,
	indexPage: PropTypes.bool,
	notFoundPage: PropTypes.bool,
	component: PropTypes.func.isRequired,
	exactPath: PropTypes.bool
}