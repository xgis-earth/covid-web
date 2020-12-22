import React from "react";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {showCountry} from "../functions";

class WorldRegions extends React.Component {

    render() {
        if (!this.props.continents) {
            return <React.Fragment/>
        }

        return (
            <React.Fragment>
                <div style={{marginTop: "1rem", marginLeft: "0.5rem"}}>
                    {Object.keys(this.props.continents).map((name, i) => {
                        const continent = this.props.continents[name];
                        return (
                            <div key={i}>
                                <h4>{name}</h4>
                                <ul>
                                    {continent.map((country, j) => {
                                        const code = country.additionalData['iso_alpha2'];
                                        return (
                                            <li key={j}>
                                                <Link to={`/country/${code}`}
                                                      onClick={(event) => {
                                                          event.preventDefault();
                                                          showCountry(
                                                              code,
                                                              this.props.countryEntities,
                                                              this.props.cesiumRef.current.cesiumElement);
                                                          this.props.history.push(`/country/${code}`);
                                                      }}>
                                                    {country.properties['Country Name']}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </React.Fragment>
        )
    }
}

const mapReduxStateToProps = (state) => ({
    continents: state.globe.continents,
    countries: state.globe.countries,
    countryEntities: state.globe.countryEntities,
    cesiumRef: state.globe.cesiumRef,
});

const mapReduxDispatchToProps = (/*dispatch*/) => ({
    // Not used
});

export default connect(
    mapReduxStateToProps,
    mapReduxDispatchToProps
)(withRouter(WorldRegions));
