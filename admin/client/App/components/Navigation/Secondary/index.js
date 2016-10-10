/**
 * The secondary navigation links to inidvidual lists of a section
 */

import React from 'react';
import { Container } from 'elemental';
import { connect } from 'react-redux';
import SecondaryNavItem from './NavItem';

var SecondaryNavigation = React.createClass({
	displayName: 'SecondaryNavigation',
	propTypes: {
		currentListKey: React.PropTypes.string,
		lists: React.PropTypes.array.isRequired,
	},
	getInitialState () {
		return {};
	},
	// Handle resizing and hide this nav on mobile (i.e. < 768px) screens
	componentDidMount () {
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
	},
	componentWillUnmount () {
		window.removeEventListener('resize', this.handleResize);
	},
	handleResize () {
		this.setState({
			navIsVisible: this.props.lists && Object.keys(this.props.lists).length > 0 && window.innerWidth >= 768,
		});
	},
	// Render the navigation
	renderNavigation (lists) {
		const {isAdmin} = Keystone.user;
		const {abilities} = this.props;

		const navigation = lists.filter(({key}) => {
			return isAdmin || abilities.indexOf(key) !== -1;
		}).map((list) => {
			// Get the link and the classname
			const href = list.external ? list.path : `${Keystone.adminPath}/${list.path}`;
			const className = (this.props.currentListKey && this.props.currentListKey === list.path) ? 'active' : null;

			return (
				<SecondaryNavItem
					key={list.path}
					path={list.path}
					className={className}
					href={href}
				>
					{list.label}
				</SecondaryNavItem>
			);
		});

		return (
			<ul className="app-nav app-nav--secondary app-nav--left">
				{navigation}
			</ul>
		);
	},
	render () {
		if (!this.state.navIsVisible) return null;

		return (
			<nav className="secondary-navbar">
				<Container clearfix>
					{this.renderNavigation(this.props.lists)}
				</Container>
			</nav>
		);
	},
});

module.exports = connect((state) => ({
	abilities: state.permissions.abilities
}))(SecondaryNavigation);

