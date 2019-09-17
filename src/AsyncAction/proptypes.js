import PropTypes from 'prop-types';

export const AsyncActionPropTypes = {
	url: PropTypes.string.isRequired,
	method: PropTypes.string,
	data: PropTypes.object,
	params: PropTypes.object,
	headers: PropTypes.object,
	dataFieldName: PropTypes.string,
	successFlagName: PropTypes.string,
	textResponse: PropTypes.bool,
	addToStoreAs: PropTypes.string,
	getData: PropTypes.func,
	getParams: PropTypes.func,
	onStart: PropTypes.func,
	onSuccess: PropTypes.func,
	onFailure: PropTypes.func,
	onError: PropTypes.func
}