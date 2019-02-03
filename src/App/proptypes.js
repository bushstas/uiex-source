import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const AppPropTypes = {
	...UIEXComponentPropTypes,
	initialPage: PropTypes.string,
	initialPageParams: PropTypes.object,
	hashRouting: PropTypes.bool,
	loaderView: PROPTYPE.REACT_NODES,
	pageNotFoundView: PROPTYPE.REACT_NODES,
	criticalErrorView: PROPTYPE.REACT_NODES,
	indexPageName: PropTypes.string,
	onChangePage: PropTypes.func
}