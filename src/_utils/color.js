
const modifyCache = {};
const checkDarkCache = {};

export const getProperColor = (color) => {
    if (color && typeof color === 'string') {
        if (color[0] === '#') {
            color = color.slice(1);
        }
        if (color.length === 3) {
            color = `${color}${color}`;
        }
        if (color.length === 6 && /^[0-9A-F]{6}$/i.test(color)) {
            return `#${color}`;
        }
    }
    return '';
};

export const modifyColor = (color, amt) => {
    const key = `${color}_${amt}`;
    if (modifyCache[key] !== undefined) {
        return modifyCache[key];
    }
    let usePound = false;
    if (color[0] == '#') {
        color = color.slice(1);
        usePound = true;
    }

    const num = parseInt(color, 16);

    let r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if  (r < 0) r = 0;

    let b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if  (b < 0) b = 0;

    let g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if  (g < 0) g = 0;

    let modifiedColor = (g | (b << 8) | (r << 16)).toString(16);
    if (modifiedColor.length === 1) {
        modifiedColor = '000000';
    } else if (modifiedColor.length === 5) {
        modifiedColor = `0${modifiedColor}`;
    }
    modifyCache[key] = (usePound ? '#' : '') + modifiedColor;
    return modifyCache[key];
};

export const isColorDark = (color, limit = 40) => {
    if (typeof color !== 'string' || color.length < 3) {
        return false;
    }
    const key = `${color}_${limit}`;
    if (checkDarkCache[key] !== undefined) {
        return checkDarkCache[key];
    }
    if (color[0] === '#') {
        color = color.substring(1);
    }
    const rgb = parseInt(color, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
console.log({luma})
    checkDarkCache[key] = luma < limit;
    return checkDarkCache[key];
};
