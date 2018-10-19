import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {LoaderPropTypes} from './proptypes';
import {Spinner} from '../Spinner';

import '../style.scss';
import './style.scss';

export class Loader extends UIEXComponent {
	static propTypes = LoaderPropTypes;
	static displayName = 'Loader';

	addClassNames(add) {
		add('overlayed', this.props.overlayed);
	}

	renderSpinner() {
		const {spinnerColor, spinnerSize, spinnerThickness} = this.props;
		return (
			<div className={this.getClassName('spinner-area')}>
				<Spinner 
					color={spinnerColor}
					size={spinnerSize}
					thickness={spinnerThickness}
				/>
			</div>
		)
	}

	renderInternal() {
		const {children, loading, overlayed} = this.props;
		const TagName = this.getTagName(); 
		return (
			<TagName {...this.getProps()}>
				{!loading || overlayed ? children : null}
				{loading && this.renderSpinner()}
			</TagName>
		)
	}
}