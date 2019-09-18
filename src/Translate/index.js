import React from 'react';
import {isString, isObject} from '../utils';
import {TranslatePropTypes} from './proptypes';

let lang = 'ru';
let dictionaries = {};
const subscribers = new Map();

export const setLang = (newLang) => {
	lang = newLang;
	notifySubscribers(dictionaries[lang], lang);
};

export const addTranslations = (translations, trLang) => {
	if (!trLang || !isString(trLang)) {
		trLang = lang;
	}
	if (isObject(translations)) {
		dictionaries[trLang] = {
			...dictionaries[trLang],
			...translations
		};
	}
	notifySubscribers(translations, trLang);
};

export const setTranslations = (translations, trLang) => {
	if (!trLang || !isString(trLang)) {
		trLang = lang;
	}
	if (isObject(translations)) {
		dictionaries[trLang] = {
			...translations
		};
	}
	notifySubscribers(translations, trLang);
};

export const loadTranslations = (url) => {
	if (isString(url)) {
		fetch(url).then(() => {
			alert('loaded')
		}, () => {
			alert('error')
		})
	}
};

export const translate = (word, trLang) => {
	if (!trLang || !isString(trLang)) {
		trLang = lang;
	}
	return isObject(dictionaries[trLang]) ? (dictionaries[trLang][word] || word) : word;
};

const notifySubscribers = (newValues, trLang) => {
	if (isObject(newValues)) {
		subscribers.forEach((word, component) => {
			const componentLang = component.props.lang;
			const {constant} = component.props;
			const {translation} = component.state;
			if (constant && translation !== word) {
				return;
			}
			if (componentLang && isString(componentLang) && componentLang !== trLang) {
				return;
			}
			if (newValues[word] && isString(newValues[word])) {
				component.setState({translation: newValues[word]});
			} else if (newValues[word] !== undefined) {
				component.setState({translation: word});
			}
		});
	}
};

const subscribe = (component, word) => {
	subscribers.set(component, word);
};

const unsubscribe = (component) => {
	subscribers.delete(component);
};

export class Translate extends React.PureComponent {
	static propTypes = TranslatePropTypes;

	constructor(props) {
		super(props);
		this.state = {
			translation: translate(props.children, props.lang)
		};
	}

	componentDidMount() {
		subscribe(this, this.props.children);
	}

	componentWillUnmount() {
		unsubscribe(this);
	}

	render() {
		return this.state.translation;
	}
}
