import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {AppPropTypes} from './proptypes';
import {isString, isNumber, isObject, isFunction, getNumber} from '../utils';
import {addTranslations} from '../Translate';
import {DEFAULT_SIDE_MENU_WIDTH} from '../SideMenu';

import '../style.scss';
import './style.scss';

const NOT_FOUND_PAGE = '404. Not found';
const PAGE_404_PATH = '404';
const DELIMITER = '_##_';
let appCount = 0;
const appLinks = {};

class LocationController {	
	getPageParams(params) {
		const {name, rawPath, path} = params;
		const key = `${name}${DELIMITER}${rawPath}`;
		const id = `${key}${DELIMITER}${path}`;
		return {
			...params,
			key,
			id,
			data: {
				name: params.name,
				path: params.rawPath || null,
				location: params.path,
				params: params.params || {}
			}
		};
	}

	get404Page({path, name}) {
		const properPath = path || PAGE_404_PATH;
		return this.getPageParams({
			rawPath: path,
			path: properPath,
			name: name || null,
			notFound: true
		});
	}

	setApp(app) {
		this.app = app;
	}

	applyParamsToPath(path, params) {
		if (isObject(params) && /\$/.test(path)) {
			for (let k in params) {
				const regex = new RegExp("\\$" + k);
				path = path.replace(regex, params[k]);
			}
		}
		return path;
	}

	navigateToPage(pageName, params) {
		if (isObject(this.app)) {
			const pageIndex = this.app.names.indexOf(pageName);
			const path = this.app.paths[pageIndex];
			let page;
			if (isNumber(pageIndex) && isString(path)) {
				page = this.getPageParams({
					homePage: path === '' || path === '/' || path === '#',
					name: pageName,
					rawPath: path,
					path: this.applyParamsToPath(path, params),
					params
				});
			} else {
				page = this.get404Page({name: pageName});
			}
			this.app.navigateToPage(page);
		}
	}

	navigateToPath(path, params) {
		if (isObject(this.app)) {
			const page = this.initPath(path, params);
			return this.app.navigateToPage(page);
		}
	}

	initCurrentLocation() {
		const {hashRouting} = this.app.props;
		const parts = window.location.toString().split('#');
		let path;
		if (hashRouting) {
			path = parts[1] || '';
		} else {
			path = parts[0];
			path = path.replace(/^[a-z]+:\/+/i, '');
		}
		if (!hashRouting) {
			const pathParts = path.split('/');
			pathParts.shift();
			if (pathParts.length == 0) {
				path = '';
			} else {
				path = pathParts.join('/');
			}
		}
		return this.initPath(path);
	}

	initPath(path, params = null) {
		path = path.replace(/^[\/\#]|\/$/g, '');
		const page = this.findPageByPath(
			this.applyParamsToPath(path, params)
		);
		if (isObject(page)) {
			const {name} = page;
			if (isString(name)) {
				return page;
			}
			if (isNumber(name)) {
				const pageName = this.app.names[name];
				if (isString(pageName)) {
					page.name = pageName;
				}
				return page;
			}
		}
		return this.get404Page({path});
	}

	findPageByPath(path) {
		const {names, paths, exactPaths} = this.app;
		let params;
		let pageIndex;
		const parts = path.split('/');
		const matchedPages = [];
		for (let i = 0; i < paths.length; i++) {
			const isExactPath = exactPaths[i];
			const pathParts = paths[i].split('/');
			if (isExactPath && parts.length != pathParts.length) {
				continue;
			}
			if (parts.length < pathParts.length) {
				continue;
			}
			let isMatched = true;
			params = {};
			pageIndex = i;
			for (let j = 0; j < parts.length; j++) {
				const pathPart = pathParts[j];
				if (pathPart == null) {
					continue;
				}
				const isAny =  pathPart.charAt(0) == '$';
				if (!isAny && parts[j] != pathPart) {
					isMatched = false;
					break;
				}
				if (isAny) {
					params[pathPart.replace(/^\$/, '')] = parts[j];
				}
			}
			if (!isMatched) {
				continue;
			}
			const pageParams = this.getPageParams({
				homePage: path === '' || path === '/' || path === '#',
				parts: pathParts.length,
				rawPath: paths[i],
				name: names[i],
				params,
				path
			});
			matchedPages.push(pageParams);
		}
		if (matchedPages.length > 0) {
			let matchedPage = null;
			let maxPartCount = 0;
			for (let i = 0; i < matchedPages.length; i++) {
				if (matchedPages[i].parts > maxPartCount) {
					maxPartCount = matchedPages[i].parts;
					matchedPage = matchedPages[i];
				}
			}
			return matchedPage;
		}
		return null;
	}
}
const locationController = new LocationController;

export const addActiveLink = (link) => {
	if (!currentLinks.includes(link)) {
		currentLinks.push(link);
	}
};

let currentLinks = [];
const highlightLink = (page, app) => {
	const links = Object.values(appLinks);
	currentLinks.forEach((link) => {
		link.setActive(false);
	});
	currentLinks = [];
	let path;
	const {paths} = app;
	if (isNumber(page)) {		
		path = paths[page];
	}
	if (isString(page)) {
		if (!path) {
			const {names} = app;
			const index = names.indexOf(page);
			if (index > -1) {
				path = paths[index];
			}
		}
		for (let i = 0; i < links.length; i++) {
			const link = links[i];
			const linkPage = link.getAppLinkPage();
			const linkPath = link.getAppLinkPath();
			const dynamicLink = link.getDynamicLink();
			if (!dynamicLink) {
				if (linkPage && page == linkPage) {
					links[i].setActive(true);
					currentLinks.push(links[i]);
					continue;
				}				
				if (path && linkPath && path == linkPath) {
					links[i].setActive(true);
					currentLinks.push(links[i]);
				}
			}
		}
	}
};

export const navigateToPage = (pageName, params) => {
	return locationController.navigateToPage(pageName, params);
};

export const navigateToPath = (path, params) => {
	return locationController.navigateToPath(path, params);
};

export const registerAppLink = (id, link) => {
	appLinks[id] = link;
};

export const unregisterAppLink = (id) => {
	const index = currentLinks.indexOf(appLinks[id]);
	if (index > -1) {
		currentLinks.splice(index, 1);
	}
	appLinks[id] = null;
	delete appLinks[id];
};

export class App extends UIEXComponent {
	static propTypes = AppPropTypes;
	static displayName = 'App';
	static properChildren = 'AppPage';
	static singleChild = true;
	static onlyProperChildren = true;

	constructor(props) {
		super(props);
		this.appIndex = appCount;
		appCount++;
		this.state = {
			page: null,
			id: ''
		};
	}

	componentDidMount() {
		if (!this.appIndex) {
			locationController.setApp(this);
			this.handleLocationChange(true);
			window.addEventListener('popstate', this.handleLocationChange, false);
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.hashRouting !== prevProps.hashRouting) {
			this.reinitPath();
		}
	}
	
	componentWillUnmount() {
		if (!this.appIndex) {
			window.removeEventListener('popstate', this.handleLocationChange, false);
		}
		appCount--;
	}

	getNewLocation(path) {
		const {hashRouting} = this.props;
		if (path === '' || path === '/') {
			return '/';
		}
		return `${hashRouting ? '/#' : '/'}${path}`;
	}

	reinitPath() {
		const {pathname, hash} = window.location;
		const {hashRouting} = this.props;
		if (hashRouting) {
			this.replaceState(pathname.replace(/^\//, ''));
		} else {
			this.replaceState(hash.replace(/^\#/, ''));
		}
	}

	initRendering() {
		this.names = [];
		this.paths = [];
		this.params = [];
		this.exactPaths = [];
	}

	initChild(child) {
		const {name, path, params, exactPath} = child.props;
		this.names.push(name);
		this.exactPaths.push(Boolean(exactPath));
		this.paths.push(String(path || name).replace(/^[\/\#]|\/$/g, ''));		
		this.params.push(params);

		return this.state.page !== null;
	}

	filterChild(child) {
		const {name, path} = child.props;
		const {page} = this.state;

		const properPath = path === '/' || path === '#' ? '' : path;
		return page === `${name}${DELIMITER}${properPath}`;
	}

	addChildProps(child, props) {
		props.params = this.state.params;
	}

	navigateToPage(page) {
		const {id, path} = page;
		if (this.state.id !== id) {
			if (isString(path)) {
				this.pushState(path);
			}
			this.handleChangePage(page);
		}
	}

	pushState(path) {
		const newPath = this.getNewLocation(path);
		window.history.pushState({}, '', newPath);
		this.fire('pushState', newPath);
	}

	replaceState(path) {
		const newPath = this.getNewLocation(path);
		window.history.replaceState({}, '', newPath);
		this.fire('replaceState', newPath);
	}

	handleLocationChange = (initial) => {
		const page = locationController.initCurrentLocation();
		this.handleChangePage(page, initial);
	}

	handleChangePage(page, initial = false) {
		const {
			key,
			id,
			name,
			params,
			notFound,
			homePage,
			data
		} = page;
		if (this.state.id !== id) {
			this.setState({page: null, params: {}}, () => {
				this.setState({page: key, id, params}, () => {					
					if (notFound) {
						this.fire('pageNotFound', data);
					} else {
						this.fire(initial ? 'initPage' : 'changePage', data);
						if (homePage && !initial) {
							this.fire('returnHome');
						}
					}
					highlightLink(name, this);
				});
			});
		}
	}

	renderNotFoundPage() {
		const {notFoundPage: NotFoundPage} = this.props;
		if (isFunction(NotFoundPage)) {
			return <NotFoundPage />;
		}
		return NOT_FOUND_PAGE;
	}

	renderInternal() {
		if (this.appIndex) {
			return 'You can\'t have more then one App components mounted';
		}
		const content = this.renderChildren();
		const {sideMenu, sideMenuWidth, sideMenuAtRight} = this.props;
		const TagName = this.getTagName();
		let style;
		if (sideMenu) {
			style = {
				[sideMenuAtRight ? 'paddingRight' : 'paddingLeft']: getNumber(sideMenuWidth, DEFAULT_SIDE_MENU_WIDTH)
			};
		}
		return (
			<TagName {...this.getProps()}>
				{sideMenu}
				<div
					className="uiex-app-content"
					style={style}
				>
					{this.properChildrenCount ? content : this.renderNotFoundPage()}
				</div>
			</TagName>
		)
	}
}