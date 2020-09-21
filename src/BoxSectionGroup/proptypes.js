import PropTypes from 'prop-types';
import {BoxSectionCommonPropTypes} from '../BoxSection/proptypes';
import {PROPTYPE} from '../consts';

export const BoxSectionGroupPropTypes = {
	...BoxSectionCommonPropTypes,
	openIndexes: PROPTYPE.NUMS,
	allOpen: PropTypes.bool,
	singleOpen: PropTypes.bool
}