import {isString, isObject, isFunction, isArray} from '../utils';
import {setStore} from '../DataProvider';

const arrayToParamsString = (name, items) => {
	return items.reduce((acc, cur) => {
		acc.push(`${name}=${cur}`);
		return acc;
	}, []).join('&');
};

const objectToParamsString = (params) => {
	if (isObject(params)) {
		const strParams = Object.keys(params).reduce((acc, cur) => {
			if (isArray(params[cur])) {
				acc.push(arrayToParamsString(cur, params[cur]));	
			} else {
				acc.push(`${cur}=${params[cur]}`);
			}
			return acc;
		}, []).join('&');
		if (strParams) {
			return `?${strParams}`;
		}
	} else if (isString(params)) {
		return `?${params.replace(/^\?/, '')}`;
	}
	return '';
};

const getUrl = (url, params) => {
	return `${url}${objectToParamsString(params)}`;
};

const addToStore = (name, data) => {
	setStore(name, data);
};

export const request = (settings) => {
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
			addToStoreAs,
			setLoading
		} = settings;
	if (url && isString(url)) {
		const options = {};
		if (method && isString(method)) {
			options.method = method;
		}
		if (data && isObject(data)) {
			options.body = JSON.stringify(data);
		} else if (isFunction(getData)) {
			const actionData = getData();
			if (actionData && isObject(actionData)) {
				options.body = JSON.stringify(actionData);
			}
		}
		if (headers && isObject(headers)) {
			options.headers = headers;
		} else {
			options.headers = {
    			'Content-Type': 'application/json;charset=utf-8'
			};
		}
		let urlParams = params;
		if ((!params || !isObject(params)) && isFunction(getParams)) {
			urlParams = getParams();
		}
		fetch(getUrl(url, urlParams), options).then((response) => {
			if (textResponse) {
				response.text().then((text) => {
					if (isFunction(setLoading)) {
						setLoading(false);
					}
					if (isFunction(onSuccess)) {
						onSuccess(text);
						if (addToStoreAs && isString(addToStoreAs)) {
							addToStore(addToStoreAs, text);
						}
					}
				}, () => {
					if (isFunction(setLoading)) {
						setLoading(false);
					}
					if (isFunction(onFailure)) {
						onFailure(response);
					}
				});
			} else {
				response.json().then((data) => {
					if (isFunction(setLoading)) {
						setLoading(false);
					}
					if (successFlagName && isString(successFlagName) && isObject(data) && data[successFlagName] === false && isFunction(onError)) {
						return onError(data);
					}
					if (dataFieldName && isString(dataFieldName) && isObject(data) && data[dataFieldName] !== undefined) {
						data = data[dataFieldName];
					}					
					if (isFunction(onSuccess)) {
						if (addToStoreAs && isString(addToStoreAs)) {
							addToStore(addToStoreAs, data);
						}
						onSuccess(data);
					}
				}, () => {
					if (isFunction(setLoading)) {
						setLoading(false);
					}
					if (isFunction(onFailure)) {
						onFailure(response);
					}
				});
			}
		}, (err) => {
			if (isFunction(setLoading)) {
				setLoading(false);
			}
			if (isFunction(onFailure)) {
				onFailure(err);
			}
		});
	}	
};
