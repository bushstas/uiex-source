import React from 'react';
import {isFunction} from '../utils';
import {request} from '../_utils/request';
import {AsyncActionPropTypes} from './proptypes';

export class AsyncAction extends React.PureComponent {
	static propTypes = AsyncActionPropTypes;
	loading = false;

	setLoading = (loading) => {
		this.loading = loading;
	}
	
	handleClick = () => {
		if (this.loading) {
			return;
		}
		this.setLoading(true);
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
			onStart,
			dataFieldName,
			successFlagName,
			textResponse,
			addToStoreAs
		} = this.props;
		if (isFunction(onStart)) {
			onStart();
		}
		request({
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
			addToStoreAs,
			setLoading: this.setLoading
		});
	}

	render() {
		return (
			<span onClick={this.handleClick}>
				{this.props.children}
			</span>
		);
	}
}
