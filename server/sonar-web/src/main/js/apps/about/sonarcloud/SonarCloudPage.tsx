/*
 * SonarQube
 * Copyright (C) 2009-2018 SonarSource SA
 * mailto:info AT sonarsource DOT com
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
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, WithRouterProps } from 'react-router';
import Footer from './Footer';
import { getCurrentUser, getMyOrganizations } from '../../../store/rootReducer';
import { CurrentUser, Organization } from '../../../app/types';
import GlobalContainer from '../../../app/components/GlobalContainer';

interface StateProps {
  currentUser: CurrentUser;
  userOrganizations?: Organization[];
}

interface OwnProps {
  children: (props: StateProps) => React.ReactNode;
}

type Props = StateProps & WithRouterProps & OwnProps;

class SonarCloudPage extends React.Component<Props> {
  componentDidMount() {
    document.documentElement.classList.add('white-page');
    document.body.classList.add('white-page');
  }

  componentWillUnmount() {
    document.documentElement.classList.remove('white-page');
    document.body.classList.remove('white-page');
  }

  render() {
    const { children, currentUser, userOrganizations } = this.props;
    return (
      <GlobalContainer footer={<Footer />} location={this.props.location}>
        {children({ currentUser, userOrganizations })}
      </GlobalContainer>
    );
  }
}

const mapStateToProps = (state: any) => ({
  currentUser: getCurrentUser(state),
  userOrganizations: getMyOrganizations(state)
});

export default withRouter<OwnProps>(
  connect<StateProps, {}, OwnProps>(mapStateToProps)(SonarCloudPage)
);
