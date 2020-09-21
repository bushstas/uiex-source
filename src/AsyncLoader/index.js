import React from 'react';
import {isFunction, isString, isArray, isObject} from '../utils';
import {request} from '../_utils/request';
import {AsyncLoaderPropTypes} from './proptypes';

export class AsyncLoader extends React.PureComponent {
	static propTypes = AsyncLoaderPropTypes;
	state = {
		loaded: false,
		success: false,
		error: null,
		failure: null
	}
	
	componentDidMount() {
		const {
			url,
			method,
			data,
			getData,
			params,
			getParams,
			headers,
			onSuccess,
			onFailure,
			onError,
			dataFieldName,
			successFlagName,
			textResponse,
			addToStoreAs
		} = this.props;
		request({
			url,
			method,
			data,
			getData,
			params,
			getParams,
			headers,
			dataFieldName,
			successFlagName,
			textResponse,
			addToStoreAs,
			onSuccess: this.handleSuccess,
			onFailure: this.handleFailure,
			onError: this.handleError
		});
	}

	handleSuccess = (data) => {
		const {onSuccess} = this.props;
		if (isFunction(onSuccess)) {
			onSuccess(data);
		}
		setTimeout(() => {
			this.setState({
				loaded: true,
				success: true,
				data
			});
		}, 10);
	}

	handleFailure = (failure) => {
		const {onFailure} = this.props;
		if (isFunction(onFailure)) {
			onFailure(failure);
		}
		setTimeout(() => {
			this.setState({
				loaded: true,
				failure
			});
		}, 10);
	}

	handleError = (error) => {
		const {onError} = this.props;
		if (isFunction(onError)) {
			onError(error);
		}
		setTimeout(() => {
			this.setState({
				loaded: true,
				error
			});
		}, 10);
	}

	render() {
		const {renderError, renderLoader, passDataAs, children} = this.props;
		const {success, error, failure, loaded, data} = this.state;
		if (success) {
			if (passDataAs && isString(passDataAs) && !isArray(children) && isObject(children) && isFunction(children.type)) {
				return React.cloneElement(children, {[passDataAs]: data});
			}
			return children;
		}
		if ((error || failure) && isFunction(renderError)) {
			return renderError(error || failure);
		}
		if (!loaded && isFunction(renderLoader)) {
			return renderLoader();
		}
		return null;
	}
}
