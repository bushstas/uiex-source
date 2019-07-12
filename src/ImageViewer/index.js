import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Modal} from '../Modal';
import {getNumber, isArray, isString, getMergedClassName} from '../utils';
import {ImageViewerPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class ImageViewer extends UIEXComponent {
	static propTypes = ImageViewerPropTypes;
	static displayName = 'ImageViewer';

	constructor(props) {
		super(props);
		this.state = {
			currentImage: getNumber(props.initialImageIndex)
		};
	}

	getPath(image) {
		const {source} = this.props;
		if (source && isString(source) && isString(image)) {
			return `${source.replace(/\/+$/, '')}/${image.replace(/^\/+/, '')}`;
		}
		return image;
	}

	getImage() {
		const {currentImage} = this.state;
		const {images, source} = this.props;
		if (isArray(images) && images[currentImage] && isString(images[currentImage])) {
			return `url(${this.getPath(images[currentImage])})`;
		}
	}

	renderInternal() {
		const {
			isOpen,
			className,
			onClose,
			width,
			height
		} = this.props;
		return (
			<Modal
				className={getMergedClassName('uiex-image-viewer', className)}
				isOpen={isOpen}
				onClose={onClose}
				width={width}
				height={height}
			>
				<div className="uiex-image-viewer-left">
					<div
						className="uiex-image-viewer-picture"
						style={{
							backgroundImage: this.getImage()
						}}
					>
					</div>
				</div>
				<div className="uiex-image-viewer-part">
					1111111
				</div>
			</Modal>
		)
	}
}
