import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const AppPropTypes = {
	...UIEXComponentPropTypes,	
	hashRouting: PropTypes.bool,
	hashPaths: PropTypes.bool,
	
	
	indexPageName: PropTypes.string,
	notFoundPageName: PROPTYPE.REACT_NODES,

	loaderView: PROPTYPE.REACT_NODES,
	criticalErrorView: PROPTYPE.REACT_NODES,
	
	sideMenu: PROPTYPE.REACT_NODES,
	sideMenuWidth: PROPTYPE.STRNUM,
	sideMenuAtRight: PropTypes.bool,
	onChangePage: PropTypes.func
}