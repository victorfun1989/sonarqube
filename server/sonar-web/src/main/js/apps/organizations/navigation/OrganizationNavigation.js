/*
 * SonarQube
 * Copyright (C) 2009-2016 SonarSource SA
 * mailto:contact AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
// @flow
import React from 'react';
import { Link } from 'react-router';
import { translate } from '../../../helpers/l10n';

const ADMIN_PATHS = [
  'edit',
  'groups',
  'delete',
  'permissions',
  'permission_templates'
];

export default class OrganizationNavigation extends React.Component {
  props: {
    location: { pathname: string },
    organization: {
      key: string,
      name: string,
      canAdmin?: boolean
    }
  };

  renderAdministration () {
    const { organization, location } = this.props;

    const adminActive = ADMIN_PATHS.some(path =>
        location.pathname.endsWith(`organizations/${organization.key}/${path}`)
    );

    return (
        <li className={adminActive ? 'active': ''}>
          <a className="dropdown-toggle navbar-admin-link" data-toggle="dropdown" href="#">
            {translate('layout.settings')}&nbsp;<i className="icon-dropdown"/>
          </a>
          <ul className="dropdown-menu">
            <li>
              <Link to={`/organizations/${organization.key}/groups`} activeClassName="active">
                {translate('user_groups.page')}
              </Link>
            </li>
            <li>
              <Link to={`/organizations/${organization.key}/permissions`} activeClassName="active">
                {translate('permissions')}
              </Link>
            </li>
            <li>
              <Link to={`/organizations/${organization.key}/permission_templates`} activeClassName="active">
                {translate('permission_templates')}
              </Link>
            </li>
            <li>
              <Link to={`/organizations/${organization.key}/edit`} activeClassName="active">
                {translate('edit')}
              </Link>
            </li>
            <li>
              <Link to={`/organizations/${organization.key}/delete`} activeClassName="active">
                {translate('delete')}
              </Link>
            </li>
          </ul>
        </li>
    );
  }

  render () {
    const { organization, location } = this.props;

    const isHomeActive = location.pathname.startsWith(`organizations/${organization.key}/projects`);

    return (
        <nav className="navbar navbar-context page-container" id="context-navigation">
          <div className="navbar-context-inner">
            <div className="container">
              <h2 className="navbar-context-title">
                <Link to={`/organizations/${organization.key}`} className="link-base-color">
                  <strong>{organization.name}</strong>
                </Link>
              </h2>

              <ul className="nav navbar-nav nav-tabs">
                <li>
                  <Link to={`/organizations/${organization.key}/projects`} className={isHomeActive ? 'active': ''}>
                    {translate('projects.page')}
                  </Link>
                </li>
                {organization.canAdmin && this.renderAdministration()}
              </ul>
            </div>
          </div>
        </nav>
    );
  }
}