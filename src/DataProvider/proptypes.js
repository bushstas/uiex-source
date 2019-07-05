import PropTypes from 'prop-types';
import {PROPTYPE} from '../consts';

export const DataProviderPropTypes = {
	formName: PROPTYPE.STRINGS,
	storeName: PROPTYPE.STRINGS,
	component: PropTypes.func.isRequired
}