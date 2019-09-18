import PropTypes from 'prop-types';
import {PROPTYPE} from '../consts';

export const AsyncLoaderPropTypes = {
	url: PROPTYPE.STRINGS.isRequired,
	method: PROPTYPE.STRINGS,
	data: PROPTYPE.OBJECTS,
	params: PROPTYPE.OBJECTS,
	headers: PROPTYPE.OBJECTS,
	dataFieldName: PROPTYPE.STRINGS,
	successFlagName: PROPTYPE.STRINGS,
	textResponse: PROPTYPE.BOOLS,
	addToStoreAs: PROPTYPE.STRINGS,
	getData: PROPTYPE.FUNCS,
	getParams: PROPTYPE.FUNCS,
	renderError: PropTypes.func,
	renderLoader: PropTypes.func,
	onStart: PropTypes.func,
	onSuccess: PropTypes.func,
	onFailure: PropTypes.func,
	onError: PropTypes.func
}