import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {JSXPreviewPropTypes} from './proptypes';
import {previewRenderer} from './utils';

import '../style.scss';
import './style.scss';

export class JSXPreview extends UIEXComponent {
	static propTypes = JSXPreviewPropTypes;
	static className = 'jsx-preview';
	static displayName = 'JSXPreview';

	renderInternal() {
		const {children} = this.props;
		const TagName = this.getTagName();
		const content = previewRenderer(children);
		return (
			<TagName {...this.getProps()}>
				<pre dangerouslySetInnerHTML={{__html: content}}/>
			</TagName>
		)
	}
}