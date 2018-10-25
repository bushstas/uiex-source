import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const AppPropTypes = {
	...UIEXComponentPropTypes,
	page: PropTypes.string,
	pageParams: PropTypes.object,
	hashRouting: PropTypes.bool,
	onChangePage: PropTypes.func
}