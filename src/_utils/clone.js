const cloneArray = (arr) => {
	return arr.map(item => clone(item));
};

const cloneObject = (obj) => {
	let newObj = {};
	Object.keys(obj).forEach(k => {
		newObj[k] = clone(obj[k]);
	});
	return newObj;
};

export const clone = (obj) => {
	if (obj instanceof Array) {
		return cloneArray(obj);
	}
	if (obj instanceof Object) {
		return cloneObject(obj);
	}
	return obj;
};
