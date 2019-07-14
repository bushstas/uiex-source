import React, {Fragment} from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Modal} from '../Modal';
import {getNumber, isArray, isString, getMergedClassName, getNumericProp, isNumber} from '../utils';
import {ImageViewerPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_WIDTH = 1600;
const DEFAULT_HEIGHT = 800;
const DEFAULT_CONTENT_SIZE_WIDTH = 30;
const MIN_CONTENT_SIZE_WIDTH = 20;
const MAX_CONTENT_SIZE_WIDTH = 80;

export class ImageViewer extends UIEXComponent {
	static propTypes = ImageViewerPropTypes;
	static displayName = 'ImageViewer';

	getPath(image) {
		const {source} = this.props;
		if (isString(image)) {
			if (/^https*:/.test(image)) {
				return image;
			}
			if (source && isString(source)) {
				return `${source.replace(/\/+$/, '')}/${image.replace(/^\/+/, '')}`;
			}
		}
		return image;
	}

	getImage() {		
		const {images, source} = this.props;
		const currentImage = getNumber(this.getProp('imageIndex'));
		if (isNumber(currentImage) && isArray(images) && images[currentImage] && isString(images[currentImage])) {
			return `url(${this.getPath(images[currentImage])})`;
		}
	}

	getLeftSideWidth() {
		return `${100 - this.contentWidth}%`;
	}

	getRightSideWidth() {
		return `${this.contentWidth}%`;
	}

	getWidth() {
		const {width} = this.props;
		return getNumber(width, DEFAULT_WIDTH);
	}

	getHeight() {
		const {height} = this.props;
		return getNumber(height, DEFAULT_HEIGHT);
	}

	getNextIndex() {
		const {looping} = this.props;
		const lastIndex = this.imagesCount - 1;
		const currentIndex = getNumber(this.getProp('imageIndex'));
		const nextIndex = currentIndex + 1;
		const noNext = nextIndex > lastIndex && !looping;
		if (lastIndex < 0 || noNext) {
			return null;
		}
		if (nextIndex <= lastIndex) {
			return nextIndex;
		}
		return 0;
	}

	getPrevIndex() {
		const {looping} = this.props;
		const lastIndex = this.imagesCount - 1;
		const currentIndex = getNumber(this.getProp('imageIndex'));
		const prevIndex = currentIndex - 1;
		const noPrev = prevIndex < 0 && !looping;
		if (lastIndex < 0 || noPrev) {
			return null;
		}
		if (prevIndex >= 0) {
			return prevIndex;
		}
		return lastIndex;
	}

	initRendering() {
		const {contentWidth, images} = this.props;
		this.contentWidth = getNumericProp(contentWidth, DEFAULT_CONTENT_SIZE_WIDTH, MIN_CONTENT_SIZE_WIDTH, MAX_CONTENT_SIZE_WIDTH);
		this.imagesCount = isArray(images) ? images.length : 0;
	}

	renderControls() {
		const {images} = this.props;
		if (this.imagesCount > 1) {
			const isPrev = isNumber(this.getPrevIndex());
			const isNext = isNumber(this.getNextIndex());
			if (!isPrev && !isNext) {
				return null;
			}
			return (
				<Fragment>
					{isPrev && 
						<div
							className="uiex-image-viewer-control uiex-prev"
							onClick={this.handlePrevClick}
						>
							PREV
						</div>
					}
					{isNext && 
						<div
							className="uiex-image-viewer-control uiex-next"
							onClick={this.handleNextClick}
						>
							NEXT
						</div>
					}
				</Fragment>
			);
		}
		return null;
	}

	renderInternal() {
		const {
			isOpen,
			onClose,
			className,
		} = this.props;
		return (
			<Modal
				className={getMergedClassName('uiex-image-viewer', className)}
				isOpen={isOpen}
				onClose={onClose}
				width={this.getWidth()}
				height={this.getHeight()}
				withoutPadding
			>
				<div
					className="uiex-image-viewer-side uiex-left-side"
					style={{width: this.getLeftSideWidth()}}
				>
					<div
						className="uiex-image-viewer-picture"
						style={{
							backgroundImage: this.getImage()
						}}
					>
						{this.renderControls()}
					</div>
				</div>
				<div
					className="uiex-image-viewer-side uiex-right-side"
					style={{width: this.getRightSideWidth()}}
				>
					1111111
				</div>
			</Modal>
		)
	}

	handlePrevClick = () => {
		this.fire('change', this.getPrevIndex());
	}

	handleNextClick = () => {
		this.fire('change', this.getNextIndex());		
	}
}
