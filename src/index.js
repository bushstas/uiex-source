import {getStyleObjectFromString} from "./utils";

export const setDefaultProps = (component, props) => {
    if (props instanceof Object) {
        if (typeof component == 'function') {            
            if (component.defaultProps) {
                component.defaultProps = {
                    ...component.defaultProps,
                    ...props
                }
            } else {
                component.defaultProps = props;
            }
            
        } else {
            return console.error('Error in setDefaultProps: The first argument should be a component class');
        }
    } else {
        return console.error('Error in setDefaultProps: The second argument should be an object');
    }
}

export const setDefaultStyle = (component, style) => {
   addDefaultStyle(component, style, 'main', '');
}

export const setDefaultStyles = (component, styles) => {
   if (styles instanceof Object) {
        for (let k in styles) {
            addDefaultStyle(component, styles[k], k, 's');
        }
    } else {
        console.error('Error in setDefaultStyles: The second argument should be an object');
    }
}

const addDefaultStyle = (component, style, name, s) => {
    s = 'setDefaultStyle' + s;
    if (style && typeof style == 'string') {
        style = getStyleObjectFromString(style);
    }
    if (style instanceof Object) {
        if (typeof component == 'function') {            
            if (name != 'main') {
                const styleNames = component.styleNames;
                if (!(styleNames instanceof Array) || styleNames.indexOf(name) == -1) {
                    console.error('Error in ' + s + ': Element "' + name + '" does not exist in the component "' + component.name + '"');
                    return;
                }
            }
            component.defaultStyles = component.defaultStyles || {}; 
            component.defaultStyles[name] = style;            
        } else {
            console.error('Error in ' + s + ': The first argument should be a component class');
        }
    } else {
        console.error('Error in ' + s + ': The second argument should be an object');
    }
}

export const addTheme = (component, theme, style) => {
    addClass(component, theme, style, 'main');
}

export const addThemes = (component, theme, styles) => {
    if (styles instanceof Object) {
        for (let k in styles) {
            addClass(component, theme, styles[k], k, 's');
        }
    } else {
        console.error('Error in addThemes: The third argument should be an object');
    }
}

const addClass = (component, theme, style, name, s) => {
    s = 'addTheme' + s;
    if (style && typeof style == 'string') {
        style = getStyleObjectFromString(style);
    }
    if (style instanceof Object) {
        if (typeof component == 'function') {
            if (name != 'main') {
                const styleNames = component.styleNames;
                if (!(styleNames instanceof Array) || styleNames.indexOf(name) == -1) {
                    console.error('Error in ' + s + ': Element "' + name + '" does not exist in the component "' + component.name + '"');
                    return;
                }
            }
            component.themes = component.themes || {}; 
            component.themes[theme] = component.themes[theme] || {};
            component.themes[theme][name] = style;            
        } else {
            console.error('Error in ' + s + ': The first argument should be a component class');
        }
    } else {
        console.error('Error in ' + s + ': The second argument should be an object');
    }
}