import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const TimeScalePropTypes = {
	...UIEXComponentPropTypes,
	value: PROPTYPE.STRNUM,
	startValue: PROPTYPE.STRNUM,
	endValue: PROPTYPE.STRNUM.isRequired,
	trackColor: PropTypes.string,
	indicatorColor: PropTypes.string,
	borderRadius: PROPTYPE.STRNUM,
	clickAreaHeight: PROPTYPE.STRNUM,
	time: PropTypes.string,
	playing: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	onChangeStatus: PropTypes.func.isRequired,
	onClickChange: PropTypes.func,
	onEnd: PropTypes.func
}