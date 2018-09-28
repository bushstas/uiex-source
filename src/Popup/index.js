import React from 'react';
import {UIEXPopup} from '../UIEXComponent';
import {PopupPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class Popup extends UIEXPopup {
	static propTypes = PopupPropTypes;
	static displayName = 'Popup';
}