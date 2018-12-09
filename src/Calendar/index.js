import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {CellGroup, Cell} from '../CellGroup';
import {Arrow} from '../Arrow';
import {isArray, getDate, getDaysInMonth} from '../utils';
import {CalendarPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thi', 'Fri', 'Sat', 'Sun'];
const DEFAULT_MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export class Calendar extends UIEXComponent {
	static propTypes = CalendarPropTypes;
	static displayName = 'Calendar';

	addClassNames(add) {
		add('year-first', this.props.yearFirst);
	}

	initRendering() {
		let {fromSunday, month, year} = this.props;
		if (!month || !year) {
			const today = getDate(this.props.date); 
			month = month || today.m;
			year = year || today.y;
		}
		const firstDayDate = getDate(`${year}-${month}-01`);
		let start;
		if (!firstDayDate.wd) {
			start = 6;
		} else {
			start = firstDayDate.wd - (fromSunday ? 0 : 1);
		}

		this.month = month;
		this.year = year;
		this.monthDaysCount = getDaysInMonth(this.year, month);
		this.monthName = this.getMonthName(month - 1);

		const lastDayDate = getDate(`${year}-${month}-${this.monthDaysCount}`);
		this.nextMonthDaysCount = 7 - lastDayDate.wd;
		console.log({
			firstDayDate,
			lastDayDate,
			nextMonthDaysCount: this.nextMonthDaysCount
		})
		this.prevYear = year;
		if (month > 1) {
			this.prevMonth = month - 1;
		} else {
			this.prevMonth = 12;
			this.prevYear = year - 1;
		}
		this.prevMonth = month > 1 ? month - 1 : 12;
		this.prevMonthDaysCount = getDaysInMonth(this.prevYear, this.prevMonth);
		this.prevMonthStartDay = this.prevMonthDaysCount - start + 1;
	}

	renderHeader() {
		return (
			<div className={this.getClassName('header')}>
				<div className={this.getClassName('month')}>
					<Arrow
						direction="left"
						color="#fff"
						size="12"
						clipped
						onClick={this.handlePickPrevMonth}
					/>
					<div className={this.getClassName('month-name')}>
						{this.monthName}
					</div>
					<Arrow
						direction="right"
						color="#fff"
						size="12"
						clipped
						onClick={this.handlePickNextMonth}
					/>
				</div>
				<div className={this.getClassName('year')}>
					{this.year}
				</div>
			</div>
		);
	}

	renderInternal() {
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				{this.renderHeader()}
				<div className={this.getClassName('table')}>
					<CellGroup
						columns="7"
						cellHeight="30"
						cellTextAlign="center"
						cellTextValign="center"
						className={this.getClassName('table-head')}
					>
						{this.renderDayNames()}
					</CellGroup>
					<CellGroup
						columns="7"
						cellHeight="30"
						cellTextAlign="center"
						cellTextValign="center"
						className={this.getClassName('table-content')}
					>
						{this.renderDays()}
					</CellGroup>
				</div>
			</TagName>
		)
	}

	renderDayNames() {
		const dayNames = this.getDayNames();
		return dayNames.map((day, idx) => (
			<Cell
				key={day}
				className={this.getClassName('table-head-cell')}
			>
				{day}
			</Cell>
		));
	}

	renderDays() {
		const cells = [];
		if (this.prevMonthStartDay > 0) {
			for (let i = this.prevMonthStartDay; i <= this.prevMonthDaysCount; i++) {
				cells.push(this.renderDayCell(i, 'prev', 'prev-month'));
			}
		}
		for (let i = 1; i <= this.monthDaysCount; i++) {
			cells.push(this.renderDayCell(i, 'current'));
		}
		if (this.nextMonthDaysCount > 0 && this.nextMonthDaysCount < 7) {
			for (let i = 1; i <= this.nextMonthDaysCount; i++) {
				cells.push(this.renderDayCell(i, 'next', 'next-month'));
			}
		}
		return cells;
	}

	renderDayCell(day, month, className = null) {
		return (
			<Cell
				key={`${month}_${day}`}
				className={className ? this.getClassName(className) : undefined}
			>
				{day}
			</Cell>
		);
	}

	getDayNames() {
		const {dayNames, fromSunday} = this.props;
		const names = isArray(dayNames) && dayNames.length >= 7 ? dayNames : DEFAULT_DAY_NAMES;
		let properDayNames;
		if (fromSunday) {
			properDayNames = [names[6], ...names.slice(0, 6)];
		}
		return properDayNames || names;
	}

	getMonthName(idx) {
		const {monthNames} = this.props;
		if (isArray(monthNames) && monthNames.length >= 12) {
			return monthNames[idx];
		}
		return DEFAULT_MONTH_NAMES[idx];
	}

	handleDayPick = (value) => {

	}

	handleChange = (name, value) => {
		this.fire('change', name, value);
	}

	handlePickPrevMonth = () => {
		const month = this.month > 1 ? this.month - 1 : 12;
		this.firePropChange('pickMonth', 'month', [month], month);
		if (month == 12) {
			const year = this.year - 1;
			this.firePropChange('pickYear', 'year', [year], year);
		}
	}

	handlePickNextMonth = () => {
		const month = this.month < 12 ? this.month + 1 : 1;
		this.firePropChange('pickMonth', 'month', [month], month);
		if (month == 1) {
			const year = this.year + 1;
			this.firePropChange('pickYear', 'year', [year], year);
		}
	}
}