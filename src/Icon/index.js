import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {MaterialIcon} from './MaterialIcon';
import {FontAwesomeIcon} from './FontAwesomeIcon';
import {LineAwesomeIcon} from './LineAwesomeIcon';
import {FoundationIcon} from './FoundationIcon';
import {LigatureSymbolsIcon} from './LigatureSymbolsIcon';
import {GenericonsIcon} from './GenericonsIcon';
import {GlyphiconsIcon} from './GlyphiconsIcon';
import {IoniconsIcon} from './IoniconsIcon';
import {IcomoonIcon} from './IcomoonIcon';

import '../style.scss';
import './style.scss';

export class Icon extends UIEXComponent {
	static displayName = 'Icon';
	
	render() {
		let TypedIcon = MaterialIcon;
		switch (this.props.type) {
			case 'FontAwesome':
				TypedIcon = FontAwesomeIcon;
			break;

			case 'LineAwesome':
				TypedIcon = LineAwesomeIcon;
			break;

			case 'Foundation':
				TypedIcon = FoundationIcon;
			break;

			case 'LigatureSymbols':
				TypedIcon = LigatureSymbolsIcon;
			break;

			case 'Genericons':
				TypedIcon = GenericonsIcon;
			break;

			case 'Glyphicons':
				TypedIcon = GlyphiconsIcon;
			break;

			case 'Ionicons':
				TypedIcon = IoniconsIcon;
			break;

			case 'IcoMoon':
				TypedIcon = IcomoonIcon;
			break;
		}
		return (
			<TypedIcon {...this.props}/>
		)
	}
}