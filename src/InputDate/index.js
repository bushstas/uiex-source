import React from 'react';
import {Input} from '../Input';
import {Icon} from '../Icon';
import {DatePicker} from '../DatePicker';
import {Popup} from '../Popup';
import {isNumber, isString, replace, getNumericProp, getDate, isObject, showError} from '../utils';
import {InputDatePropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const PROPS_LIST = ['yearFirst', 'past', 'future', 'withTime', 'delimiter', 'minYear', 'maxYear', 'periodFrom', 'periodTo', 'isTimestamp', 'inSeconds'];
const DEFAULT_DELIMITER = '.';
const MAX_YEAR = 2050;
const MIN_YEAR = 1900;

export class InputDate extends Input {
	static propTypes = InputDatePropTypes;
	static className = 'input';
	static isControl = true;
	static displayName = 'InputDate';

	constructor(props) {
		super(props);
		this.propsList = PROPS_LIST;
	}

	addClassNames(add) {
		super.addClassNames(add);
		add('date-input');
		const {withoutIcon} = this.props;
		add('without-icon', withoutIcon);
	}

	renderAdditionalInnerContent() {
		const {withoutIcon} = this.props;
		if (!withoutIcon) {
			return (
				<div className={this.getClassName('date-icon')}>
					<Icon name="date_range"/>
				</div>
			)
		}
	}

	renderAdditionalContent() {
		const pickerShown = this.getProp('pickerShown');
		if (this.props.withPicker) {
			return (
				<Popup
					ref="popup"
					isOpen={pickerShown}
					onCollapse={this.handlePopupCollapse}
				>
					{this.renderDatePicker()}
				</Popup>
			);
		}
		return null;
	}

	renderDatePicker() {
		const {datePicker} = this.props;
		if (datePicker) {
			if (React.isValidElement(datePicker) && isObject(datePicker) && datePicker.type == DatePicker) {
				return React.cloneElement(datePicker, {
					uncontrolled: true,
					value: this.value,
					onPick: this.handlePickDate
				});
			} else {
				showError('The datePicker property is not an instance of DatePicker');
			}
		}
		return (
			<DatePicker 
				value={this.value}
				uncontrolled
				onPick={this.handlePickDate}
			/>
		);
	}

	getCustomInputProps() {
		const {delimiter, withTime} = this.props;
		let delimiterLength = 2;
		if (delimiter && isString(delimiter)) {
			delimiterLength = delimiter.length * 2;
		}
		if (withTime) {
			delimiterLength += 6;
		}
		const maxLength = 8 + delimiterLength;
		return {maxLength}
	}

	getDelimiter() {
		let {delimiter} = this.props;
		if (!delimiter || !isString(delimiter)) {
			delimiter = DEFAULT_DELIMITER;
		} else {
			if (delimiter.length > 1) {
				delimiter = delimiter.charAt(0);
			}
			if ((/\d/).test(delimiter)) {
				delimiter = DEFAULT_DELIMITER;
			}
		}
		return delimiter;
	}

	filterValue(value) {
		if (isNumber(value)) {
			const len = Math.abs(value).toString().length;
			if (len >= 9) {
				if (len < 12) {
					value *= 1000;
				}
				value = this.getDateFromTimestamp(value, this.isWithTime);
				this.isWithTime = null;
			} else {
				value = value.toString();
			}
		}
		let {withTime, yearFirst} = this.props;
		const delimiter = this.getDelimiter();
		let mask;
		if (yearFirst) {
			mask = '9999' + delimiter + '99' + delimiter + '99';
		} else {
			mask = '99' + delimiter + '99' + delimiter + '9999';
		}
		if (withTime) {
			mask += ' 99:99';
		}		
		let properValue = value;
		value = this.getProperDateValue(value);
		const l = mask.length;
		let idx = 0;
		properValue = '';
		if (!value) {
			return '';
		}
		for (let i = 0; i < l; i++) {
			const maskChar = mask.charAt(i);
			if (!(/^[\d]/i).test(maskChar)) {
				properValue += maskChar;
			} else {
				properValue += value[idx++];
				if (idx >= value.length) {
					break;
				}
			}
		}
		return super.filterValue(properValue);
	}

	getProperDateValue(value) {
		const {yearFirst} = this.props;
		if (!isString(value)) {
			value = '';
		}
		const originalValue = value;
		const thirdSymbol = originalValue.charAt(2);
		value = replace(/[^\d]/g, '', value);
		if (thirdSymbol && originalValue.length > 9) {
			const isThirdSymbolNumber = (/\d/).test(thirdSymbol);
			if (!yearFirst && isThirdSymbolNumber) {
				value = value.substr(6, 2) + value.substr(4, 2) + value.substr(0, 4) + value.substr(8, 10);
			} else if (yearFirst && !isThirdSymbolNumber) {
				value = value.substr(4, 4) + value.substr(2, 2) + value.substr(0, 2) + value.substr(8, 10);
			}
		}
		let year = '', month = '', day = '', hour = '', minute = '';
		for (let i = 0; i < value.length; i++) {
			if (yearFirst) {
				if (i < 4) {
					year += value.charAt(i);
				} else if (i < 6) {
					month += value.charAt(i);
				} else if (i < 8) {
					day += value.charAt(i);
				}
			} else {
				if (i < 2) {
					day += value.charAt(i);
				} else if (i < 4) {
					month += value.charAt(i);
				} else if (i < 8) {
					year += value.charAt(i);
				}
			}
			if (i > 7 && i < 10) {
				hour += value.charAt(i);
			} else if (i > 9) {
				minute += value.charAt(i);
			}
		}
		return this.getProperDateValues({
			year, month, day, hour, minute
		});
	}

	getProperDateValues(values) {
		const {yearFirst, past, future, withTime, periodFrom, periodTo} = this.props;
		const minYear = getNumericProp(this.props.minYear, MIN_YEAR, MIN_YEAR, MAX_YEAR);
		const maxYear = getNumericProp(this.props.maxYear, MAX_YEAR, MIN_YEAR, MAX_YEAR);
		let {year, month, day, hour, minute} = values;
		if ((yearFirst && !year) || (!yearFirst && !day)) {
			return '';
		}
		if (month) {
			if (~~month > 12) {
				month = '12';
			} else if (month == '00') {
				month = '01';
			}
			if (~~day > 31) {
				day = '31';
			} else if (day == '00') {
				day = '01';
			}
			if (~~hour > 23) {
				hour = '23';
			}
			if (~~minute > 59) {
				minute = '59';
			}
		}
		if (year && year.length == 4) {
			if (isNumber(minYear)) {
				year = Math.max(minYear, ~~year);
			}
			if (isNumber(maxYear)) {
				year = Math.min(maxYear, ~~year);
			}
			year = String(year);
			if (past || future || periodFrom || periodTo) {
				const data = {year, month, day, hour, minute};
				let d;
				if (periodFrom || periodTo) {
					d = this.validatePeriod(data);
				} else if (past) {
					d = this.validatePast(data);
				} else if (future) {
					d = this.validateFuture(data);
				}
				year = String(d.year);
				month = String(d.month);
				day = String(d.day);
				hour = String(d.hour);
				minute = String(d.minute);
			}
		}
		let value;
		year = year || '';
		month = month || '';
		day = day || '';
		if (yearFirst) {
			value = year + month + day;
		} else {
			value = day + month + year;
		}
		if (withTime) {
			if (hour) {
				value += hour;
			}
			if (minute) {
				value += minute;
			}
		}
		this.cachedDateParts = {
			year,
			month,
			day,
			hour,
			minute
		};
		return value;
	}

	validatePeriod(data) {
		const {periodFrom, periodTo} = this.props;
		if (periodFrom) {
			const validated = this.validateFuture(data, periodFrom);
			if (validated) {
				data = validated;
			}
		}
		if (periodTo) {
			const validated = this.validatePast(data, periodTo);
			if (validated) {
				data = validated;
			}
		}
		return data;
	}

	validatePast(data, dateStr = null) {
		let {year, month, day, hour, minute} = data;
		const date = this.getDate(dateStr);
		if (!date) {
			return null;
		}
		if (~~year > date.y) {
			year = date.y;
		}
		if (~~year == date.y && month && month.length == 2) {
			if (~~month > date.m) {
				month = this.getProper(date.m);
			} 
			if (~~month == date.m && day && day.length == 2) {
				if (~~day > date.d) {
					day = this.getProper(date.d);
				}
				if (~~day == date.d && hour && hour.length == 2) {
					if (~~hour > date.h) {
						hour = this.getProper(date.h);
					}
					if (~~hour == date.h && minute && minute.length == 2) {
						if (~~minute > date.n) {
							minute = this.getProper(date.n);
						}
					}
				}
			}
		}
		return {year, month, day, hour, minute};
	}

	validateFuture(data, dateStr = null) {
		let {year, month, day, hour, minute} = data;
		const date = this.getDate(dateStr);
		if (!date) {
			return null;
		}
		if (~~year < date.y) {
			year = date.y;
		}
		if (~~year == date.y && month && month.length == 2) {
			if (~~month < date.m) {
				month = this.getProper(date.m);
			} 
			if (~~month == date.m && day && day.length == 2) {
				if (~~day < date.d) {
					day = this.getProper(date.d);
				}
				if (~~day == date.d && hour && hour.length == 2) {
					if (~~hour < date.h) {
						hour = this.getProper(date.h);
					}
					if (~~hour == date.h && minute && minute.length == 2) {
						if (~~minute < date.n) {
							minute = this.getProper(date.n);
						}
					}
				}
			}
		}
		return {year, month, day, hour, minute};
	}

	getProperOutcomingValue(value) {
		value = this.filterValue(value);
		let {withTime, isTimestamp, inSeconds} = this.props;
		this.isWithTime = null;
		if (isTimestamp) {
			const {year, month, day, hour, minute} = this.cachedDateParts;
			let isProper = year.length == 4 && month.length == 2 && day.length == 2;
			if (withTime && isProper) {
				isProper = isString(hour) && isString(minute) &&
						hour.length == 2 && minute.length == 2;
				if (!hour && !minute) {
					isProper = true;
					withTime = false;
				}
			}
			this.isWithTime = withTime;
			if (isProper) {
				const date = `${year}-${month}-${day}`;
				const timestamp = new Date(`${date}${withTime ? ` ${hour}:${minute}`: ''}`).getTime();
				return inSeconds ? timestamp / 1000 : timestamp;
			}
		}
		return value;
	}

	getDate(stamp = null) {
		return getDate(stamp);
	}

	getProper(v) {
		if (v < 10) {
			v = '0' + v;
		}
		return v;
	}

	isValueValid(value) {
		const {withTime, required} = this.props;
		if (value || required) {
			if (value == null) {
				value = '';
			}
			if (isNumber(value)) {
				value = this.value;
			}
			const length = withTime ? 16 : 10;
			return value.length == length;
		}
		return null;
	}

	getDateFromTimestamp(timestamp, isWithTime = true) {
		let {d, m, y, h, n} = this.getDate(timestamp);
		d = this.getProper(d);
		m = this.getProper(m);
		h = this.getProper(h);
		n = this.getProper(n);
		let value;
		if (isWithTime !== false) {
			value = `${d}.${m}.${y} ${h}:${n}`;
		} else {
			value = `${d}.${m}.${y}`;
		}
		return value;
	}

	parseInitialValue(value) {
		if (isString(value)) {
			const {withTime: isWithTime} = this.props;
			let date = (new Date()).getTime();
			let timestamp, withTime;
			switch (value) {
				case 'now':
				case 'today':
					timestamp = date;
					withTime = isWithTime || value == 'now';
				break;

				case 'yesterday':
					timestamp = date - 86400000;
				break;

				case 'tomorrow':
					timestamp = date + 86400000;
				break;

				default:
					value = value.replace(/\s/g, '').replace(/^([\+\-])(\d+)([a-z]+)$/, "$1 $2 $3");
					const parts = value.split(' ');
					if (parts.length == 3) {
						let m;
						const num = Number(parts[1]);
						if (num && !Number.isNaN(num)) {
							switch (parts[2]) {
								case 's':
								case 'sec':
								case 'second':
								case 'seconds':
									m = 1000;
								break;
								
								case 'min':
								case 'minute':
								case 'minutes':
									m = 60000;
								break;
								
								case 'h':
								case 'hour':
								case 'hours':
									m = 3600000;
								break;

								case 'd':
								case 'day':
								case 'days':
									m = 86400000;
								break;

								case 'w':
								case 'week':
								case 'weeks':
									m = 86400000 * 7;
								break;

								case 'm':
								case 'month':
								case 'months':
									m = 86400000 * 30;
								break;

								case 'y':
								case 'year':
								case 'years':
									m = 86400000 * 365;
								break;
							}
						}
						timestamp = date + m * num * (parts[0] == '-' ? -1 : 1);
					} else {
						return null;
					}
			}
			return this.getDateFromTimestamp(timestamp, withTime);
		}
		return value;
	}

	handlePickDate = (value, day, month, year) => {
		this.fireChange(value);
		this.fire('pick', value, {day, month, year}, this.props.name);
		setTimeout(this.handlePopupCollapse, 0);
	}

	clickHandler() {
		const {disabled, readOnly, withPicker, pickerShown} = this.props;
		if (!pickerShown && withPicker && !disabled && !readOnly) {
			super.clickHandler();
			this.fireShowPicker(true);
		}
	}

	handlePopupCollapse = () => {
		this.fireShowPicker(false);
	}

	handleEnter() {
		this.handlePopupCollapse();
	}

	handleEscape() {
		this.handlePopupCollapse();
	}

	fireShowPicker(pickerShown) {
		this.firePropChange('showPicker', 'pickerShown', [pickerShown, this.props.name], pickerShown);
	}
}