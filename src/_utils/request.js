import {isString, isObject, isFunction, isArray} from '../utils';
import {setStore} from '../DataProvider';

const arrayToParamsString = (name, items) => {
	return items.reduce((acc, cur) => {
		acc.push(`${name}=${cur}`);
		return acc;
	}, []).join('&');
};

const objectToParamsString = (params, url) => {
	const firstSymbol = isString(url) && /\?/.test(url) ? '&' : '?';
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
			return `${firstSymbol}${strParams}`;
		}
	} else if (isString(params)) {
		return `${firstSymbol}${params.replace(/^\?/, '')}`;
	}
	return '';
};

const getUrl = (url, params) => {
	return `${url}${objectToParamsString(params, url)}`;
};

const addToStore = (name, data) => {
	setStore(name, data);
};

const getResponseArray = (data) => {
	const keys = Object.keys(data);
	if (keys.length === 1) {
		return data[keys[0]];
	}
	keys.sort();
	return keys.map((key) => {
		return data[key];
	});
};

export const request = (settings) => {
	let {
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

	const totalRequests = isArray(url) ? url.length : 1;
	let requestsDone = 0;
	const successData = {};
	const failureData = {};
	const errorData = {};
	let withFailure = false;
	let withError = false;

	if (!isArray(url)) {
		url = [url];
	}
	if (!isArray(addToStoreAs)) {
		addToStoreAs = [addToStoreAs];
	}

	const onDone = () => {
		if (isFunction(setLoading)) {
			setLoading(false);
		}
		if (withFailure) {
			if (isFunction(onSuccess)) {
				onFailure(getResponseArray(failureData));
			}	
		} else if (withError) {
			if (isFunction(onError)) {
				onError(getResponseArray(errorData));
			}	
		} else if (isFunction(onSuccess)) {
			onSuccess(getResponseArray(successData));
		}
	};

	const onSuccessHandler = (data, idx) => {
		requestsDone++;
		successData[idx] = data;
		failureData[idx] = null;
		errorData[idx] = null;

		if (addToStoreAs[idx] && isString(addToStoreAs[idx])) {
			addToStore(addToStoreAs[idx], data);
		}
		if (totalRequests <= requestsDone) {
			onDone();
		}
	};

	const onFailureHandler = (response, idx) => {
		requestsDone++;
		withFailure = true;
		successData[idx] = null;
		failureData[idx] = response;
		errorData[idx] = null;

		if (totalRequests <= requestsDone) {
			onDone();
		}
	};

	const onErrorHandler = (data, idx) => {
		requestsDone++;
		withError = true;
		successData[idx] = null;
		failureData[idx] = null;
		errorData[idx] = data;
		
		if (totalRequests <= requestsDone) {
			onDone();
		}
	};

	const getMethod = (idx) => {
		if (method) {
			if (isArray(method)) {
				return isString(method[idx]) ? method[idx] : undefined;
			}
			if (isString(method)) {
				return method;
			}
		}
		return undefined;
	};

	const getBody = (idx) => {
		let body;
		if (data) {
			if (isArray(data)) {
				body = isObject(data[idx]) ? data[idx] : undefined;
			} else if (isObject(data)) {
				body = data;
			}			
		}
		if (!isObject(body) && getData) {
			if (isArray(getData)) {
				body = isFunction(getData[idx]) ? getData[idx]() : undefined;
			} else if (isFunction(getData)) {
				body = getData();
			}	
		}
		if (isObject(body)) {
			return JSON.stringify(body);
		}
		return undefined;
	};

	const getHeaders = (idx) => {
		if (headers) {
			if (isArray(headers)) {
				return isObject(headers[idx]) ? headers[idx] : undefined;
			}
			if (isObject(headers)) {
				return headers;
			}
		}
		return {
	    	'Content-Type': 'application/json;charset=utf-8'
		};
	};

	const getUrlParams = (idx) => {
		let urlParams;
		if (isArray(urlParams) && isObject(urlParams[idx])) {
			urlParams = urlParams[idx];
		} else if (isObject(params)) {
			urlParams = params;
		}
		if (!isObject(urlParams) && getParams) {
			if (isArray(getParams)) {
				urlParams = isFunction(getParams[idx]) ? getParams[idx]() : undefined;
			} else if (isFunction(getParams)) {
				urlParams = getParams();
			}	
		}
		return isObject(urlParams) ? urlParams : undefined;
	};

	const isTextResponse = (idx) => {
		if (isArray(textResponse)) {
			return textResponse[idx] || false;
		}
		return Boolean(textResponse);
	};

	const getSuccessFlag = (idx) => {
		if (isArray(successFlagName) && isString(successFlagName[idx])) {
			return successFlagName[idx];
		}
		return successFlagName;
	};

	const getDataField = (idx) => {
		if (isArray(dataFieldName) && isString(dataFieldName[idx])) {
			return dataFieldName[idx];
		}
		return dataFieldName;
	};

	const processRequest = (requestUrl, idx) => {
		if (requestUrl && isString(requestUrl)) {
			const options = {
				method: getMethod(idx),
				body: getBody(idx),
				headers: getHeaders(idx)
			};			
			fetch(getUrl(requestUrl, getUrlParams(idx)), options).then((response) => {
				if (isTextResponse(idx)) {
					response.text().then((text) => {						
						onSuccessHandler(text, idx);
					}, () => {
						onFailureHandler(response, idx);
					});
				} else {
					response.json().then((data) => {
						const successFlag = getSuccessFlag(idx);
						const dataField = getDataField(idx);
						if (successFlag && isString(successFlag) && isObject(data) && data[successFlag] === false) {
							return onErrorHandler(data, idx);
						}
						if (dataField && isString(dataField) && isObject(data) && data[dataField] !== undefined) {
							data = data[dataField];
						}	
						onSuccessHandler(data, idx);				
					}, () => {
						onFailureHandler(response, idx);
					});
				}
			}, (err) => {
				onFailureHandler(err, idx);
			});
		}
	}
	url.forEach(processRequest);
};
