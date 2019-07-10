import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {isArray, getNumber} from '../utils';
import {CellGroup, Cell} from '../CellGroup';
import {Image} from '../Image';
import {GALLERY_BEHAVIORS} from '../consts';
import {GalleryPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_COLUMNS = 10;

export class Gallery extends UIEXComponent {
	static propTypes = GalleryPropTypes;
	static displayName = 'Gallery'

	addClassNames(add) {
		let {behavior} = this.props;
		if (!behavior || GALLERY_BEHAVIORS.indexOf(behavior) === -1) {
			behavior = GALLERY_BEHAVIORS[0];
		}
		add(`behavior-${behavior}`);
	}

	renderImage = (image, idx) => {
		const {
			behavior,
			imageWidth,
			imageHeight,
			imageMargin,
			reflectionHeight,
			reflectionMargin,
			reflectionOpacity,
			reflected,
			backgroundSize,
			backgroundRepeat,
			borderWidth,
			borderColor,
			borderRadius,
			borderOpacity
		} = this.props;
		return (
			<Image
				key={idx !== undefined ? `${image}_${idx}` : undefined}
				className="uiex-gallery-image"
				src={image}
				width={imageWidth}
				height={imageHeight}
				marginBottom={behavior !== 'grid' ? imageMargin : undefined}
				marginRight={imageMargin}
				reflectionHeight={reflectionHeight}
				reflectionMargin={reflectionMargin}
				reflectionOpacity={reflectionOpacity}
				backgroundSize={backgroundSize}
				backgroundRepeat={backgroundRepeat}				
				borderWidth={borderWidth}
				borderColor={borderColor}
				borderRadius={borderRadius}
				borderOpacity={borderOpacity}
				reflected={reflected}
			/>
		);
	}

	renderImageCell = (image, idx) => {
		return (
			<Cell key={`${image}_${idx}`}>
				{this.renderImage(image)}
			</Cell>
		);
	}

	renderImages() {
		const {images, behavior, imageMargin} = this.props;
		const columns = getNumber(this.props.columns, DEFAULT_COLUMNS);
		if (!isArray(images)) {
			return null;
		}
		if (behavior === 'grid') {
			return (
				<CellGroup
					columns={columns}
					cellMargin={imageMargin}
					rowMargin={imageMargin}
				>
					{images.map(this.renderImageCell)}			
				</CellGroup>
			);
		}
		return images.map(this.renderImage);
	}

	renderInternal() {
		const TagName = this.getTagName();
		const {imageMargin, behavior} = this.props;
		return (
			<TagName {...this.getProps()}>
				<div className="uiex-gallery-outer">
					<div
						className="uiex-gallery-inner"
						style={behavior !== 'grid' ? {width: `calc(100% + ${getNumber(imageMargin)}px)`} : undefined}
					>
						{this.renderImages()}
					</div>
				</div>
			</TagName>
		)
	}
}