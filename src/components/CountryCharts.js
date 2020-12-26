import $ from "jquery";
import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import "flot-latest";
import "flot-latest/jquery.flot.time";
import "flot-latest/jquery.flot.resize";
import gql from "graphql-tag";
import Spinner from "./Spinner";
import {fetch} from "../graphql_fetch";
import {
    addDays,
    addYears,
    getBarPlot,
    getPlot,
    getPlotFromTimestampedSeries,
    hideLoading,
    renderBarChart,
    renderChart,
} from "../functions";
import Constants from "../constants";

class CountryCharts extends React.Component {

    static propTypes = {
        countryCode: PropTypes.string.isRequired
    };

    casesChartRef = React.createRef();
    deathsChartRef = React.createRef();
    dailyDeathsChartRef = React.createRef();
    recoveredChartRef = React.createRef();
    testsChartRef = React.createRef();
    populationChartRef = React.createRef();

    state = {
        fetching: false
    };

    render() {
        if (!this.props.countries[this.props.countryCode].additionalData) {
            return <React.Fragment/>;
        }

        const countries = this.props.countries;
        const country = countries[this.props.countryCode];

        let cases = parseInt(country.additionalData['covid_confirmed']);
        let deaths = parseInt(country.additionalData['covid_deaths']);
        let recovered = parseInt(country.additionalData['covid_recovered']);
        let tests = parseInt(country.additionalData['covid_tests']);
        let population = parseInt(country.additionalData['population']);

        cases = isNaN(cases) ? 0 : cases;
        deaths = isNaN(deaths) ? 0 : deaths;
        recovered = isNaN(recovered) ? 0 : recovered;
        tests = isNaN(tests) ? 0 : tests;
        population = isNaN(population) ? 0 : population;

        return (
            <React.Fragment>
                {this.state.fetching &&
                <Spinner/>
                }
                <div style={{display: this.state.fetching ? 'none' : ''}}>
                    {cases > 0 &&
                    <div className="card" style={{marginTop: "1rem"}}>
                        <div className="card-header">
                            Cases
                        </div>
                        <div className="card-body">
                            <div ref={this.casesChartRef}
                                 className="timeline-chart"
                                 style={styles.chart}/>
                        </div>
                    </div>
                    }
                    {deaths > 0 &&
                    <React.Fragment>
                        <div className="card" style={{marginTop: "1rem"}}>
                            <div className="card-header">
                                Deaths
                            </div>
                            <div className="card-body">
                                <div ref={this.deathsChartRef}
                                     className="timeline-chart"
                                     style={styles.chart}/>
                            </div>
                        </div>
                        <div className="card" style={{marginTop: "1rem"}}>
                            <div className="card-header">
                                Deaths (daily totals)
                            </div>
                            <div className="card-body">
                                <div ref={this.dailyDeathsChartRef}
                                     id="daily-deaths-timeline-chart"
                                     className="timeline-chart"
                                     style={styles.chart}/>
                            </div>
                        </div>
                    </React.Fragment>
                    }
                    {recovered > 0 &&
                    <div className="card" style={{marginTop: "1rem"}}>
                        <div className="card-header">
                            Recovered
                        </div>
                        <div className="card-body">
                            <div ref={this.recoveredChartRef}
                                 className="timeline-chart"
                                 style={styles.chart}/>
                        </div>
                    </div>
                    }
                    {tests > 0 &&
                    <div className="card" style={{marginTop: "1rem"}}>
                        <div className="card-header">
                            Tests
                        </div>
                        <div className="card-body">
                            <div ref={this.testsChartRef}
                                 className="timeline-chart"
                                 style={styles.chart}/>
                        </div>
                    </div>
                    }
                    {population > 0 &&
                    <div className="card" style={{marginTop: "1rem"}}>
                        <div className="card-header">
                            Population
                        </div>
                        <div className="card-body">
                            <div ref={this.populationChartRef}
                                 className="timeline-chart"
                                 style={styles.chart}/>
                        </div>
                    </div>
                    }
                </div>
            </React.Fragment>
        )
    }

    componentDidMount() {
        this.getCharts();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.countryCode !== prevProps.countryCode) {
            this.getCharts();
        }
    }

    getCharts() {
        this.setState({fetching: true});

        const query = gql`
            query ($country_code: String!) {
                country(where: {iso_alpha2: {_eq: $country_code}}) {
                    population_time_series
                    covid_confirmed_time_series
                    covid_deaths_time_series
                    covid_recovered_time_series
                    covid_tests_time_series
                }
            }
        `;

        const variables = {
            country_code: this.props.countryCode
        };

        try {
            fetch(query, variables).then(response => {
                console.assert(response && response.data && response.data.country, response);
                this.setState({fetching: false});
                this.renderCharts(response.data.country[0]);
            })
        } catch (e) {
            hideLoading();
            this.setState({fetching: false});
            console.error(e);
        }
    }

    renderCharts(data) {
        const start = new Date('2020-01-22');
        const timeFormat = '%d %b';
        const labelWidth = Constants.chartsYLabelWidth;
        const deathsTimeSeries = JSON.parse(data['covid_deaths_time_series'])
        this.renderConfirmedChart(JSON.parse(data['covid_confirmed_time_series']), start, timeFormat, labelWidth);
        this.renderDeathsChart(deathsTimeSeries, start, timeFormat, labelWidth);
        this.renderDailyDeathsChart(deathsTimeSeries, start, timeFormat, labelWidth);
        this.renderRecoveredChart(JSON.parse(data['covid_recovered_time_series']), start, timeFormat, labelWidth);
        this.renderTestsChart(JSON.parse(data['covid_tests_time_series']), timeFormat, labelWidth);
        this.renderPopulationChart(JSON.parse(data['population_time_series']), new Date('1960'), '%Y', labelWidth);
    }

    renderConfirmedChart(timeSeries, start, timeFormat, labelWidth) {
        if (this.casesChartRef.current) {
            const chart = $(this.casesChartRef.current);
            const plot = getPlot(start, timeSeries, addDays);
            renderChart(0, plot, timeFormat, labelWidth, timeSeries, chart, 'Cases');
        }
    }

    renderDeathsChart(timeSeries, start, timeFormat, labelWidth) {
        if (this.deathsChartRef.current) {
            const chart = $(this.deathsChartRef.current);
            const plot = getPlot(start, timeSeries, addDays);
            renderChart(0, plot, timeFormat, labelWidth, timeSeries, chart, 'Deaths');
        }
    }

    renderDailyDeathsChart(timeSeries, start, timeFormat, labelWidth) {
        if (this.dailyDeathsChartRef.current) {
            const chart = $(this.dailyDeathsChartRef.current);
            const plot = getBarPlot(start, timeSeries, addDays);
            renderBarChart(0, plot, timeFormat, labelWidth, timeSeries, chart, 'Daily Death Totals');
        }
    }

    renderRecoveredChart(timeSeries, start, timeFormat, labelWidth) {
        if (this.recoveredChartRef.current) {
            const chart = $(this.recoveredChartRef.current);
            const plot = getPlot(start, timeSeries, addDays);
            renderChart(0, plot, timeFormat, labelWidth, timeSeries, chart, 'Recovered');
        }
    }

    renderTestsChart(timeSeries, timeFormat, labelWidth) {
        if (this.testsChartRef.current) {
            const chart = $(this.testsChartRef.current);
            const plot = getPlotFromTimestampedSeries(timeSeries);
            renderChart(0, plot, timeFormat, labelWidth, timeSeries, chart, 'Tests');
        }
    }

    renderPopulationChart(timeSeries, start, timeFormat, labelWidth) {
        if (this.populationChartRef.current) {
            const chart = $(this.populationChartRef.current);
            const plot = getPlot(start, timeSeries, addYears);
            renderChart(undefined, plot, timeFormat, labelWidth, timeSeries, chart, 'Population');
        }
    }
}

const styles = {
    chart: {
        width: "100%",
        height: "300px"
    }
};

const mapReduxStateToProps = (state) => ({
    countries: state.globe.countries,
});

const mapReduxDispatchToProps = (/*dispatch*/) => ({
    // Not used
});

export default connect(
    mapReduxStateToProps,
    mapReduxDispatchToProps
)(CountryCharts);
