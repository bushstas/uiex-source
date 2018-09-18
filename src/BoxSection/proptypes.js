import PropTypes from 'prop-types';
import {BoxPropTypes} from '../Box';
import {PROPTYPE} from '../consts';

export const BoxSectionPropTypes = {
	...BoxPropTypes,
	caption: PROPTYPE.REACT_NODES.isRequired,
	note: PROPTYPE.REACT_NODES
}