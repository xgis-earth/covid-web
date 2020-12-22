import React from "react";
import {connect} from "react-redux";
import {Switch, Route, Link, matchPath, withRouter} from "react-router-dom";
import {setSelectedEntity} from "../redux/actions/globe";
import WorldSummary from "./WorldSummary";
import WorldRegions from "./WorldRegions";
import WorldCountries from "./WorldCountries";
import WorldCharts from "./WorldCharts";
import NotFound from "./NotFound";

class World extends React.Component {

    render() {

        // Deselect any selected entity.
        if (this.props.selectedEntity !== null) {
            this.props.onSetSelectedEntity(null);
        }

        // Get selected tab name.
        let selectedTab;

        if (this.props.location.pathname === '/') {
            selectedTab = 'summary';
        }

        if (!selectedTab) {
            let match = matchPath(this.props.location.pathname, {
                path: '/:tab',
                exact: true
            });

            selectedTab = match?.params.tab;
        }

        // Used to enable the selected tab.
        const getClasses = (tab) => tab === selectedTab
            ? 'nav-link active'
            : 'nav-link';

        return (
            <div style={{margin: "12px"}}>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active">World</li>
                    </ol>
                </nav>
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <Link to="/"
                              className={getClasses('summary')}>
                            Summary
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/charts"
                              className={getClasses('charts')}>
                            Charts
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/countries"
                              className={getClasses('countries')}>
                            Countries
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/regions"
                              className={getClasses('regions')}>
                            Regions
                        </Link>
                    </li>
                </ul>
                <Switch>
                    <Route exact path="/" render={() =>
                        <WorldSummary/>
                    }/>
                    <Route exact path="/charts" render={() =>
                        <WorldCharts/>
                    }/>
                    <Route exact path="/countries" render={() =>
                        <WorldCountries/>
                    }/>
                    <Route exact path="/regions" render={() =>
                        <WorldRegions/>
                    }/>
                    <Route render={() => (
                        <NotFound/>
                    )}/>
                </Switch>
            </div>
        )
    }
}

const mapReduxStateToProps = (state) => ({
    selectedEntity: state.globe.selectedEntity,
});

const mapReduxDispatchToProps = (dispatch) => ({
    onSetSelectedEntity: (entity) => dispatch(setSelectedEntity(entity)),
});

export default connect(
    mapReduxStateToProps,
    mapReduxDispatchToProps
)(withRouter(World));
