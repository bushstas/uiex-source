import React from 'react';
import {isString, isObject} from '../utils';
import {TranslateCutPropTypes} from './proptypes';

let lang = 'eng';
let dictionaries = {};
export const setLang = (newLang) => {
	lang = newLang;
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
	return isObject(dictionaries[trLang]) ? dictionaries[trLang][word] : word;
};

export const Translate = (props) => (
	translate(props.children)
);
