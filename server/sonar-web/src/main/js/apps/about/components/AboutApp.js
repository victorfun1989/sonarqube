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
// @flow
import React from 'react';
import { connect } from 'react-redux';
import { keyBy } from 'lodash';
import { Link } from 'react-router';
import AboutProjects from './AboutProjects';
import EntryIssueTypes from './EntryIssueTypes';
import AboutLanguages from './AboutLanguages';
import AboutCleanCode from './AboutCleanCode';
import AboutQualityModel from './AboutQualityModel';
import AboutQualityGates from './AboutQualityGates';
import AboutLeakPeriod from './AboutLeakPeriod';
import AboutStandards from './AboutStandards';
import AboutScanners from './AboutScanners';
import { searchProjects } from '../../../api/components';
import { getFacet } from '../../../api/issues';
import GlobalContainer from '../../../app/components/GlobalContainer';
import { getAppState, getCurrentUser, getGlobalSettingValue } from '../../../store/rootReducer';
import { translate } from '../../../helpers/l10n';
import { fetchAboutPageSettings } from '../actions';
import { isSonarCloud } from '../../../helpers/system';
import '../styles.css';

/*::
type State = {
  loading: boolean,
  projectsCount: number,
  issueTypes?: {
    [key: string]: ?{
      count: number
    }
  }
};
*/

class AboutApp extends React.PureComponent {
  /*:: mounted: boolean; */

  /*:: props: {
    appState: {
      defaultOrganization: string,
      organizationsEnabled: boolean
    },
    currentUser: { isLoggedIn: boolean },
    customText?: string,
    fetchAboutPageSettings: () => Promise<*>,
    location: { pathname: string }
  };
*/

  state /*: State */ = {
    loading: true,
    projectsCount: 0
  };

  componentDidMount() {
    this.mounted = true;
    if (isSonarCloud()) {
      window.location = 'https://about.sonarcloud.io';
    } else {
      this.loadData();
      // $FlowFixMe
      document.body.classList.add('white-page');
      // $FlowFixMe
      document.documentElement.classList.add('white-page');
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    // $FlowFixMe
    document.body.classList.remove('white-page');
    // $FlowFixMe
    document.documentElement.classList.remove('white-page');
  }

  loadProjects() {
    return searchProjects({ ps: 1 }).then(r => r.paging.total);
  }

  loadIssues() {
    return getFacet({ resolved: false }, 'types');
  }

  loadCustomText() {
    return this.props.fetchAboutPageSettings();
  }

  loadData() {
    Promise.all([this.loadProjects(), this.loadIssues(), this.loadCustomText()]).then(
      responses => {
        if (this.mounted) {
          const [projectsCount, issues] = responses;
          const issueTypes = keyBy(issues.facet, 'val');
          this.setState({
            projectsCount,
            issueTypes,
            loading: false
          });
        }
      },
      () => {
        if (this.mounted) {
          this.setState({ loading: false });
        }
      }
    );
  }

  render() {
    const { customText } = this.props;
    const { loading, issueTypes, projectsCount } = this.state;

    if (isSonarCloud()) {
      return null;
    }

    let bugs;
    let vulnerabilities;
    let codeSmells;
    if (!loading && issueTypes) {
      bugs = issueTypes['BUG'] && issueTypes['BUG'].count;
      vulnerabilities = issueTypes['VULNERABILITY'] && issueTypes['VULNERABILITY'].count;
      codeSmells = issueTypes['CODE_SMELL'] && issueTypes['CODE_SMELL'].count;
    }

    return (
      <GlobalContainer location={this.props.location}>
        <div className="page page-limited about-page" id="about-page">
          <div className="about-page-entry">
            <div className="about-page-intro">
              <h1 className="big-spacer-bottom">{translate('layout.sonar.slogan')}</h1>
              {!this.props.currentUser.isLoggedIn && (
                <Link className="button button-active big-spacer-right" to="/sessions/new">
                  {translate('layout.login')}
                </Link>
              )}
              <a
                className="button"
                href="https://redirect.sonarsource.com/doc/home.html"
                rel="noopener noreferrer"
                target="_blank">
                {translate('about_page.read_documentation')}
              </a>
            </div>

            <div className="about-page-instance">
              <AboutProjects count={projectsCount} loading={loading} />
              <EntryIssueTypes
                bugs={bugs}
                codeSmells={codeSmells}
                loading={loading}
                vulnerabilities={vulnerabilities}
              />
            </div>
          </div>

          {customText != null &&
            customText.value && (
              <div
                className="about-page-section"
                dangerouslySetInnerHTML={{ __html: customText.value }}
              />
            )}

          <AboutLanguages />

          <AboutQualityModel />

          <div className="flex-columns">
            <div className="flex-column flex-column-half about-page-group-boxes">
              <AboutCleanCode />
            </div>
            <div className="flex-column flex-column-half about-page-group-boxes">
              <AboutLeakPeriod />
            </div>
          </div>

          <div className="flex-columns">
            <div className="flex-column flex-column-half about-page-group-boxes">
              <AboutQualityGates />
            </div>
            <div className="flex-column flex-column-half about-page-group-boxes">
              <AboutStandards appState={this.props.appState} />
            </div>
          </div>

          <AboutScanners />
        </div>
      </GlobalContainer>
    );
  }
}

const mapStateToProps = state => ({
  appState: getAppState(state),
  currentUser: getCurrentUser(state),
  customText: getGlobalSettingValue(state, 'sonar.lf.aboutText')
});

const mapDispatchToProps = { fetchAboutPageSettings };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutApp);
