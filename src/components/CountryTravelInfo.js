import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import gql from "graphql-tag";
import moment from "moment";
import Spinner from "./Spinner";
import {fetch} from "../graphql_fetch";
import {hideLoading} from "../functions";

class CountryTravelInfo extends React.Component {

    static propTypes = {
        countryCode: PropTypes.string.isRequired
    };

    state = {
        fetching: false,
        travelInfo: undefined
    };

    render() {
        if (this.state.fetching) {
            return <Spinner/>
        }

        if (!this.state.travelInfo) {
            return <React.Fragment/>
        }

        if (this.state.travelInfo && this.state.airlineInfo && this.state.airlineInfo.length === 0) {
            return (
                <div style={{marginTop: "1rem", marginLeft: "0.5rem"}}>
                    There is no travel information available for this country.
                </div>
            )
        }

        const travel = this.state.travelInfo;
        const airlines = this.state.airlineInfo;

        return (
            <React.Fragment>
                {travel.info &&
                <div style={{marginTop: "1rem", marginLeft: "0.5rem"}}>
                    <ReactMarkdown>
                        {travel.info}
                    </ReactMarkdown>
                </div>
                }
                {travel.restrictions &&
                <div className="card" style={{marginTop: "1rem"}}>
                    <div className="card-header">
                        Restrictions
                    </div>
                    <div className="card-body">
                        <ReactMarkdown>
                            {travel.restrictions}
                        </ReactMarkdown>
                    </div>
                </div>
                }
                {travel.sources &&
                <div style={{marginTop: "1rem", marginLeft: "0.5rem"}} className="text-muted">
                    Sources:
                    <ReactMarkdown>
                        {travel.sources}
                    </ReactMarkdown>
                </div>
                }
                {airlines && airlines.length > 0 &&
                <div className="card" style={{marginTop: "1rem"}}>
                    <div className="card-header">
                        Airline announcements
                    </div>
                    <div className="card-body">
                        <ul>
                            {airlines.map((airline, i) => {
                                const source = airline.source;
                                let info = airline.info && airline.info.endsWith('.') ? airline.info : `${airline.info}.`;
                                if (source.indexOf('http://') === 0 || source.indexOf('https://') === 0) {
                                    return (
                                        <li key={i}>
                                            <a href={airline.source} target="_blank">
                                                {info}
                                            </a> <span className="text-muted">
                                                ({moment(airline['published']).fromNow()})
                                            </span>
                                        </li>
                                    )
                                }
                                return (
                                    <li key={i}>
                                        {info} <span className="text-muted">
                                            ({airline.source}, {moment(airline['published']).fromNow()})
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                }
            </React.Fragment>
        )
    }

    componentDidMount() {
        this.getTravelInfo();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.countryCode !== prevProps.countryCode) {
            this.setState({articles: undefined});
            this.getTravelInfo();
        }
    }

    getTravelInfo() {
        this.setState({fetching: true});

        const query = gql`
            query ($country_code: String!) {
                country_travel_info(country_code: $country_code) {
                    info
                    published
                    restrictions
                    sources
                }
                country_airline_info(country_code: $country_code) {
                    info
                    name
                    published
                    source
                }
            }
        `;

        const variables = {
            country_code: this.props.countryCode
        };

        try {
            fetch(query, variables).then(response => {
                console.assert(response && response.data && response.data.country_travel_info, response);
                this.setState({
                    travelInfo: response.data.country_travel_info,
                    airlineInfo: response.data.country_airline_info || [],
                    fetching: false
                });
            })
        } catch (e) {
            hideLoading();
            this.setState({fetching: false});
            console.error(e);
        }
    }
}

function linesToParagraphs(...nodes) {
    return nodes
        .map(node => typeof node === 'string'
            ? node.split('\n').map((text, i) => <p key={i}>{text}</p>)
            : node)
        .reduce((nodes, node) => nodes.concat(node), []);
}

export default CountryTravelInfo;
