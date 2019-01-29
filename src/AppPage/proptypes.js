import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const AppPagePropTypes = {
	...UIEXComponentPropTypes,
	name: PropTypes.string,
	path: PropTypes.string,
	params: PropTypes.object,
	indexPage: PropTypes.bool,
	notFoundPage: PropTypes.bool,
	content: PROPTYPE.REACT_NODES,
	component: PropTypes.func
}