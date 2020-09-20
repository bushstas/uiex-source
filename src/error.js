import React from 'react';

export const showImproperChildError = (child, parent) => {
	const {type, name} = getChildTypeAndName(child);
 	let expectedChildren = parent.getExpectedChildren();
	const expected = typeof expectedChildren == 'string' ? 'The only expected child' : 'Expected children';
	if (isArray(expectedChildren)) {
		expectedChildren = expectedChildren.join(', ');
	}
	return (
		<div>Improper {type} child "{name}" in {parent.constructor.name}. {expected}: {expectedChildren}</div>
	);
}

export const showForbiddenChildError = (child, parent) => {
	const {type, name} = getChildTypeAndName(child);
	return (
		<div>Not allowed {type} child "{name}" in {parent.constructor.name}</div>
	);
}

export const showImproperParentError = (child, expectedParents) => {
	const name = child.constructor.name;
	if (isArray(expectedParents)) {
		expectedParents = expectedParents.join(', ');
	}
	return (
		<div>Component {name} has no a proper parent. Expected parents: {expectedParents}</div>
	);
}

export const showProperChildMaxCountError  = (child, parent) => {
	let expectedChildren = parent.getExpectedChildren();
	if (isArray(expectedChildren)) {
		expectedChildren = expectedChildren.join(', ');
	}
	const maxCount = parent.getProperChildMaxCount();
	return (
		<div>Component {parent.constructor.name} can have only {maxCount} child of type {expectedChildren}</div>
	);
}
