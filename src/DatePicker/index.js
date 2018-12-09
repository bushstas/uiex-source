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
		const {day, month, year} = this.state;
		const {
			value,
			dayNames,
			monthNames,
			fromSunday,
			yearFirst
		} = this.props;
		return (
			<TagName {...this.getProps()}>
				<Calendar
					date={value}
					dayNames={dayNames}
					monthNames={monthNames}
					day={day}
					month={month}
					year={year}
					yearFirst={yearFirst}
					fromSunday={fromSunday}
					onPickDay={this.handlePickDay}
					onPickMonth={this.handlePickMonth}
					onPickYear={this.handlePickYear}
				/>
			</TagName>
		)
	}

	handlePickDay = (day, month, year) => {
		this.firePropChange('pickDay', null, [day, month, year], {day, month, year});
	}

	handlePickMonth = (month, year) => {
		this.firePropChange('pickMonth', null, [month, year], {month, year});
	}

	handlePickYear = (year) => {
		this.firePropChange('pickYear', 'year', [year], year);
	}

	fireChange = (value) => {
		this.firePropChange('change', 'value', [value], value);
	}
}
