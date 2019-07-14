const loaded = {};
export const loadImage = (src, callback) => {
	if (!loaded[src]) {
		loaded[src] = new Image();
		loaded[src].src = src;
	}
	const check = () => {
		const {complete} = loaded[src];
		if (complete) {
			callback();
			return true;
		}
		setTimeout(check, 200);		
		return false;
	};
	return check();
};
