import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {ImageViewerPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class ImageViewer extends UIEXComponent {
	static propTypes = ImageViewerPropTypes;
	static displayName = 'ImageViewer';
	static className = 'image-viewer';

}
