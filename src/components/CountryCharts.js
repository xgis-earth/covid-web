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
    getBarPlotFromTimestampedSeries,
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
    dailyCasesChartRef = React.createRef();
    deathsChartRef = React.createRef();
    dailyDeathsChartRef = React.createRef();
    recoveredChartRef = React.createRef();
    testsChartRef = React.createRef();
    dailyTestsChartRef = React.createRef();
    vaccinationsChartRef = React.createRef();
    hospitalisationsChartRef = React.createRef();
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
        let vaccinations = parseInt(country.additionalData['covid_vaccinations']);
        let hospitalisations = parseInt(country.additionalData['covid_hospitalisations']);
        let population = parseInt(country.additionalData['population']);

        cases = isNaN(cases) ? 0 : cases;
        deaths = isNaN(deaths) ? 0 : deaths;
        recovered = isNaN(recovered) ? 0 : recovered;
        tests = isNaN(tests) ? 0 : tests;
        vaccinations = isNaN(vaccinations) ? 0 : vaccinations;
        hospitalisations = isNaN(hospitalisations) ? 0 : hospitalisations;
        population = isNaN(population) ? 0 : population;

        return (
            <React.Fragment>
                {this.state.fetching &&
                <Spinner/>
                }
                <div style={{display: this.state.fetching ? 'none' : ''}}>
                    {vaccinations > 0 &&
                    <React.Fragment>
                        <div className="card" style={{marginTop: "1rem"}}>
                            <div className="card-header">
                                Vaccinations
                            </div>
                            <div className="card-body">
                                <div ref={this.vaccinationsChartRef}
                                     className="timeline-chart"
                                     style={styles.chart}/>
                            </div>
                        </div>
                    </React.Fragment>
                    }
                    {hospitalisations > 0 &&
                    <React.Fragment>
                        <div className="card" style={{marginTop: "1rem"}}>
                            <div className="card-header">
                                Hospitalisations (daily totals)
                            </div>
                            <div className="card-body">
                                <div ref={this.hospitalisationsChartRef}
                                     className="timeline-chart"
                                     style={styles.chart}/>
                            </div>
                        </div>
                    </React.Fragment>
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
                                     className="timeline-chart"
                                     style={styles.chart}/>
                            </div>
                        </div>
                    </React.Fragment>
                    }
                    {cases > 0 &&
                    <React.Fragment>
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
                        <div className="card" style={{marginTop: "1rem"}}>
                            <div className="card-header">
                                Cases (daily totals)
                            </div>
                            <div className="card-body">
                                <div ref={this.dailyCasesChartRef}
                                     className="timeline-chart"
                                     style={styles.chart}/>
                            </div>
                        </div>
                    </React.Fragment>
                    }
                    {recovered > 0 &&
                    <React.Fragment>
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
                    </React.Fragment>
                    }
                    {tests > 0 &&
                    <React.Fragment>
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
                        <div className="card" style={{marginTop: "1rem"}}>
                            <div className="card-header">
                                Tests (daily totals)
                            </div>
                            <div className="card-body">
                                <div ref={this.dailyTestsChartRef}
                                     className="timeline-chart"
                                     style={styles.chart}/>
                            </div>
                        </div>
                    </React.Fragment>
                    }
                    {population > 0 &&
                    <React.Fragment>
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
                    </React.Fragment>
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
                    covid_vaccinations_time_series
                    covid_hospitalisations_time_series
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
        const startDate = new Date('2020-01-22');
        const endDate = new Date();
        const timeFormat = '%d %b';
        const labelWidth = Constants.chartsYLabelWidth;

        const confirmedTimeSeries = JSON.parse(data['covid_confirmed_time_series'])
        const deathsTimeSeries = JSON.parse(data['covid_deaths_time_series'])
        const testsTimeSeries = JSON.parse(data['covid_tests_time_series'])
        const vaccinationsTimeSeries = JSON.parse(data['covid_vaccinations_time_series'])
        const hospitalisationsTimeSeries = JSON.parse(data['covid_hospitalisations_time_series'])
        const recoveredTimeSeries = JSON.parse(data['covid_recovered_time_series'])
        const populationTimeSeries = JSON.parse(data['population_time_series'])

        this.renderConfirmedChart(confirmedTimeSeries, startDate, endDate, timeFormat, labelWidth);
        this.renderDailyConfirmedChart(confirmedTimeSeries, startDate, endDate, timeFormat, labelWidth);
        this.renderDeathsChart(deathsTimeSeries, startDate, endDate, timeFormat, labelWidth);
        this.renderDailyDeathsChart(deathsTimeSeries, startDate, endDate, timeFormat, labelWidth);
        this.renderVaccinationsChart(vaccinationsTimeSeries, startDate, endDate, timeFormat, labelWidth);
        this.renderHospitalisationsChart(hospitalisationsTimeSeries, startDate, endDate, timeFormat, labelWidth);
        this.renderRecoveredChart(recoveredTimeSeries, startDate, endDate, timeFormat, labelWidth);
        this.renderTestsChart(testsTimeSeries, startDate, endDate, timeFormat, labelWidth);
        this.renderDailyTestsChart(testsTimeSeries, startDate, endDate, timeFormat, labelWidth);
        this.renderPopulationChart(populationTimeSeries, new Date('1960'), endDate, '%Y', labelWidth);
    }

    renderConfirmedChart(timeSeries, startDate, endDate, timeFormat, labelWidth) {
        if (this.casesChartRef.current) {
            const chart = $(this.casesChartRef.current);
            const plot = getPlot(startDate, timeSeries, addDays);
            renderChart(0, plot, timeFormat, labelWidth, timeSeries, chart, startDate, endDate);
        }
    }

    renderDailyConfirmedChart(timeSeries, startDate, endDate, timeFormat, labelWidth) {
        if (this.dailyCasesChartRef.current) {
            const chart = $(this.dailyCasesChartRef.current);
            const plot = getBarPlot(startDate, timeSeries, addDays);
            renderBarChart(0, plot, timeFormat, labelWidth, timeSeries, chart, startDate, endDate);
        }
    }

    renderDeathsChart(timeSeries, startDate, endDate, timeFormat, labelWidth) {
        if (this.deathsChartRef.current) {
            const chart = $(this.deathsChartRef.current);
            const plot = getPlot(startDate, timeSeries, addDays);
            renderChart(0, plot, timeFormat, labelWidth, timeSeries, chart, startDate, endDate);
        }
    }

    renderDailyDeathsChart(timeSeries, startDate, endDate, timeFormat, labelWidth) {
        if (this.dailyDeathsChartRef.current) {
            const chart = $(this.dailyDeathsChartRef.current);
            const plot = getBarPlot(startDate, timeSeries, addDays);
            renderBarChart(0, plot, timeFormat, labelWidth, timeSeries, chart, startDate, endDate);
        }
    }

    renderVaccinationsChart(timeSeries, startDate, endDate, timeFormat, labelWidth) {
        if (this.vaccinationsChartRef.current) {
            const chart = $(this.vaccinationsChartRef.current);
            const plot = getPlotFromTimestampedSeries(timeSeries);
            renderChart(0, plot, timeFormat, labelWidth, timeSeries, chart, startDate, endDate);
        }
    }

    renderHospitalisationsChart(timeSeries, startDate, endDate, timeFormat, labelWidth) {
        if (this.hospitalisationsChartRef.current) {
            const chart = $(this.hospitalisationsChartRef.current);
            const plot = getPlotFromTimestampedSeries(timeSeries);
            renderChart(0, plot, timeFormat, labelWidth, timeSeries, chart, startDate, endDate);
        }
    }

    renderRecoveredChart(timeSeries, startDate, endDate, timeFormat, labelWidth) {
        if (this.recoveredChartRef.current) {
            const chart = $(this.recoveredChartRef.current);
            const plot = getPlot(startDate, timeSeries, addDays);
            renderChart(0, plot, timeFormat, labelWidth, timeSeries, chart, startDate, endDate);
        }
    }

    renderTestsChart(timeSeries, startDate, endDate, timeFormat, labelWidth) {
        if (this.testsChartRef.current) {
            const chart = $(this.testsChartRef.current);
            const plot = getPlotFromTimestampedSeries(timeSeries);
            renderChart(0, plot, timeFormat, labelWidth, timeSeries, chart, startDate, endDate);
        }
    }

    renderDailyTestsChart(timeSeries, startDate, endDate, timeFormat, labelWidth) {
        if (this.dailyTestsChartRef.current) {
            const chart = $(this.dailyTestsChartRef.current);
            const plot = getBarPlotFromTimestampedSeries(timeSeries);
            renderBarChart(0, plot, timeFormat, labelWidth, timeSeries, chart, startDate, endDate);
        }
    }

    renderPopulationChart(timeSeries, startDate, endDate, timeFormat, labelWidth) {
        if (this.populationChartRef.current) {
            const chart = $(this.populationChartRef.current);
            const plot = getPlot(startDate, timeSeries, addYears);
            renderChart(undefined, plot, timeFormat, labelWidth, timeSeries, chart);
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
