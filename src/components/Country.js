import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Switch, Route, Link, matchPath, withRouter} from "react-router-dom";
import {setInitialEntity} from "../redux/actions/globe";
import {getCountryEntity, showCountry} from "../functions";
import CountrySummary from "./CountrySummary";
import CountryCharts from "./CountryCharts";
import CountryNews from "./CountryNews";
import NotFound from "./NotFound";
import CountryTravelInfo from "./CountryTravelInfo";

class Country extends React.Component {

    static propTypes = {
        countryCode: PropTypes.string.isRequired
    };

    render() {
        if (!this.props.countries || !this.props.countryEntities) {
            return <React.Fragment/>
        }

        const country = this.props.countries[this.props.countryCode];
        if (!country) {
            return <NotFound/>
        }

        if (!this.props.initialEntity) {
            const entity = getCountryEntity(this.props.countryCode, this.props.countryEntities);
            this.props.onSetInitialEntity(entity);
        }

        const countryName = country.properties['Country Name'];

        // Get selected tab name.
        let selectedTab;

        let match = matchPath(this.props.location.pathname, {
            path: '/country/:code',
            exact: true
        });

        if (match?.params.code) {
            selectedTab = 'summary';
        }

        if (!selectedTab) {
            match = matchPath(this.props.location.pathname, {
                path: '/country/:code/:tab',
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
                        <li className="breadcrumb-item"><Link to="/">World</Link></li>
                        <li className="breadcrumb-item"><Link to="/countries">Countries</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{countryName}</li>
                    </ol>
                </nav>
                <button type="button"
                        className="btn btn-outline-primary"
                        style={{marginBottom: "1rem"}}
                        onClick={(event) => {
                            event.preventDefault();
                            showCountry(
                                this.props.countryCode,
                                this.props.countryEntities,
                                this.props.cesiumRef.current.cesiumElement);
                        }}>
                    Zoom To
                </button>
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <Link to={`/country/${this.props.countryCode}`}
                              className={getClasses('summary')}>
                            Summary
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to={`/country/${this.props.countryCode}/charts`}
                              className={getClasses('charts')}>
                            Charts
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to={`/country/${this.props.countryCode}/news`}
                              className={getClasses('news')}>
                            News
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to={`/country/${this.props.countryCode}/travel`}
                              className={getClasses('travel')}>
                            Travel
                        </Link>
                    </li>
{/*
                    <li className="nav-item">
                        <Link to={`/country/${this.props.countryCode}/government-measures`}
                              className={getClasses('government-measures')}>
                            Government Measures
                        </Link>
                    </li>
*/}
                </ul>
                <Switch>
                    <Route exact path="/country/:code" render={({match}) =>
                        <CountrySummary countryCode={match.params.code}/>
                    }/>
                    <Route exact path="/country/:code/charts" render={({match}) =>
                        <CountryCharts countryCode={match.params.code}/>
                    }/>
                    <Route exact path="/country/:code/news" render={({match}) =>
                        <CountryNews countryCode={match.params.code}/>
                    }/>
                    <Route exact path="/country/:code/travel" render={({match}) =>
                        <CountryTravelInfo countryCode={match.params.code}/>
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
    countries: state.globe.countries,
    cesiumRef: state.globe.cesiumRef,
    countryEntities: state.globe.countryEntities,
    initialEntity: state.globe.initialEntity,
});

const mapReduxDispatchToProps = (dispatch) => ({
    onSetInitialEntity: (entity) => dispatch(setInitialEntity(entity)),
});

export default connect(
    mapReduxStateToProps,
    mapReduxDispatchToProps
)(withRouter(Country));
