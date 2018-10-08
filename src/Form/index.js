import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {ButtonGroup} from '../ButtonGroup';
import {Button} from '../Button';
import {getNumber} from '../utils';
import {FormPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_LINE_MARGIN = 15;

export class Form extends UIEXComponent {
	static propTypes = FormPropTypes;
	static properChildren = ['FormControl', 'FormControlGroup'];
	static displayName = 'Form';

	addChildProps(child, props) {
		const {type: control} = child;
		switch (control.name) {
			case 'FormControl':
				if (typeof child.props.onChange != 'function') {
					props.onChange = this.handleChange;
				}
			break;

			case 'FormControlGroup':
				let {rowMargin = DEFAULT_LINE_MARGIN, columns, cellSize} = this.props;
				const {columnsTiny, columnsSmall, columnsMiddle, columnsLarger, columnsLarge, columnsHuge, columnsGigantic} = this.props;
				rowMargin = getNumber(rowMargin);
				if (rowMargin) {
					props.rowMargin = rowMargin;
				}
				if (columns && !child.props.columns) {
					props.columns = columns;
				}
				if (columnsTiny && !child.props.columnsTiny) {
					props.columnsTiny = columnsTiny;
				}
				if (columnsSmall && !child.props.columnsSmall) {
					props.columnsSmall = columnsSmall;
				}
				if (columnsMiddle && !child.props.columnsMiddle) {
					props.columnsMiddle = columnsMiddle;
				}
				if (columnsLarger && !child.props.columnsLarger) {
					props.columnsLarger = columnsLarger;
				}
				if (columnsLarge && !child.props.columnsLarge) {
					props.columnsLarge = columnsLarge;
				}
				if (columnsHuge && !child.props.columnsHuge) {
					props.columnsHuge = columnsHuge;
				}
				if (columnsGigantic && !child.props.columnsGigantic) {
					props.columnsGigantic = columnsGigantic;
				}
				if (cellSize && !child.props.cellSize) {
					props.cellSize = cellSize;
				}
				if (typeof child.props.onChange != 'function') {
					props.onChange = this.handleChange;
				}
			break;
		}
	}

	renderInternal() {
		const {caption} = this.props;
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				{caption &&
					<div className="uiex-form-caption">
						{caption}
					</div>
				}
				{this.renderChildren()}
				{this.renderButtons()}
			</TagName>
		)
	}

	renderButtons() {
		const {submit, clear} = this.props;
		if (submit || clear) {
			return (
				<ButtonGroup className="uiex-form-buttons">
					{submit && 
						<Button>
							{submit}
						</Button>
					}
					{clear && 
						<Button>
							{clear}
						</Button>
					}
				</ButtonGroup>
			)
		}
		return null;
	}

	handleChange = (name, value) => {
		this.fire('change', name, value);
	}
}