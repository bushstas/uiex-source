import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Calendar} from '../Calendar';
import {DatePickerPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class DatePicker extends UIEXComponent {
	static propTypes = DatePickerPropTypes;
	static displayName = 'DatePicker';
	static className = 'date-picker';

	renderInternal() {
		const TagName = this.getTagName();
		const value = this.getProp('value');
		const {
			dayNames,
			monthNames,
			fromSunday,
			yearFirst,
			markedDays,
			markedDaysDisabled
		} = this.props;
		return (
			<TagName {...this.getProps()}>
				<Calendar
					date={value}
					markedDays={markedDays}
					dayNames={dayNames}
					monthNames={monthNames}
					yearFirst={yearFirst}
					fromSunday={fromSunday}
					markedDaysDisabled={markedDaysDisabled}
					onPickDate={this.handlePickDate}
				/>
			</TagName>
		)
	}

	handlePickDate = (date, day, month, year) => {
		this.firePropChange('pick', 'value', [date, day, month, year], date);
	}
}
