import React from 'react';
import {isArray} from './utils';

const style = {color: 'red'};

export const showImproperChildError = (child, parent) => {
	const {type, name} = getChildTypeAndName(child);
 	let expectedChildren = parent.getExpectedChildren();
	const expected = typeof expectedChildren == 'string' ? 'The only expected child' : 'Expected children';
	if (isArray(expectedChildren)) {
		expectedChildren = expectedChildren.join(', ');
	}
	return (
		<div style={style}>Improper {type} child "{name}" in {parent.constructor.name}. {expected}: {expectedChildren}</div>
	);
}

export const showForbiddenChildError = (child, parent) => {
	const {type, name} = getChildTypeAndName(child);
	return (
		<div style={style}>Not allowed {type} child "{name}" in {parent.constructor.name}</div>
	);
}

export const showImproperParentError = (child, expectedParents) => {
	const name = child.constructor.name;
	if (isArray(expectedParents)) {
		expectedParents = expectedParents.join(', ');
	}
	return (
		<div style={style}>Component {name} has no a proper parent. Expected parents: {expectedParents}</div>
	);
}

export const showProperChildMaxCountError  = (child, parent) => {
	let expectedChildren = parent.getExpectedChildren();
	if (isArray(expectedChildren)) {
		expectedChildren = expectedChildren.join(', ');
	}
	const maxCount = parent.getProperChildMaxCount();
	return (
		<div style={style}>Component {parent.constructor.name} can have only {maxCount} child of type {expectedChildren}</div>
	);
}
