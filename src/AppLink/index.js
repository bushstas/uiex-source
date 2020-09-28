import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Button} from '../Button';
import {goToPage, goToPath, addActiveLink, registerAppLink, unregisterAppLink} from '../App';
import {isString, isObject} from '../utils';
import {AppLinkPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

let linkId = 0;

export class AppLink extends UIEXComponent {
    static propTypes = AppLinkPropTypes;
    static displayName = 'AppLink';
    static className = 'app-link';

    constructor(props) {
        super(props);
        linkId++;
        this.linkId = linkId;
        const {path, params} = this.props;
        this.linkPath = isString(path) ? path.replace(/^\/|\/$/g, '') : null;
        this.dynamicLink = (isString(path) && /\$/.test(path)) || isObject(params);
        registerAppLink(linkId, this);
    }

    componentWillUnmount() {
        unregisterAppLink(this.linkId);
    }

    getCustomProps() {
        return {
            onClick: this.handleClick
        }
    }

    getAppLinkPage = () => {
        return this.props.page;
    }

    getAppLinkPath = () => {
        return this.linkPath;
    }

    getDynamicLink = () => {
        return this.dynamicLink;
    }

    setActive = (active) => {
        this.setState({active});
    }

    handleClick = () => {
        const {page, params} = this.props;
        if (isString(page)) {
            goToPage(page, params);
        } else {
            goToPath(this.linkPath, params);
        }
        this.setActive(true);
        setTimeout(() => addActiveLink(this));
    }

    renderInternal() {
        let {children, isButton, page, path, ...rest} = this.props;
        const TagName = this.getTagName();
        let active = false;
        if (this.state && this.state.active) {
            active = true;
        }
        if (isButton) {
            return (
                <Button
                    {...rest}
                    onClick={this.handleClick}
                    active={active}
                >
                    {children}
                </Button>
            );
        }
        return (
            <TagName {...this.getProps()}>
                {children}
            </TagName>
        )
    }
}