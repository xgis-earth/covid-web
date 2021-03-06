import $ from "jquery";
import React from "react";
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
    hideLoading,
    renderBarChart,
    renderChart,
} from "../functions";
import Constants from "../constants";

class WorldCharts extends React.Component {

    casesChartRef = React.createRef();
    dailyCasesChartRef = React.createRef();
    deathsChartRef = React.createRef();
    dailyDeathsChartRef = React.createRef();
    recoveredChartRef = React.createRef();
    populationChartRef = React.createRef();

    state = {
        fetching: false
    };

    render() {
        return (
            <React.Fragment>
                {this.state.fetching &&
                <Spinner/>
                }
                <div style={{display: this.state.fetching ? 'none' : ''}}>
                    <div className="card" style={{marginTop: "1rem"}}>
                        <div className="card-header">
                            Cases - Daily Totals
                        </div>
                        <div className="card-body">
                            <div ref={this.dailyCasesChartRef}
                                 className="timeline-chart"
                                 style={styles.chart}/>
                        </div>
                    </div>
                    <div className="card" style={{marginTop: "1rem"}}>
                        <div className="card-header">
                            Deaths - Daily Totals
                        </div>
                        <div className="card-body">
                            <div ref={this.dailyDeathsChartRef}
                                 className="timeline-chart"
                                 style={styles.chart}/>
                        </div>
                    </div>
                    <div className="card" style={{marginTop: "1rem"}}>
                        <div className="card-header">
                            Total Cases
                        </div>
                        <div className="card-body">
                            <div ref={this.casesChartRef}
                                 className="timeline-chart"
                                 style={styles.chart}/>
                        </div>
                    </div>
                    <div className="card" style={{marginTop: "1rem"}}>
                        <div className="card-header">
                            Total Deaths
                        </div>
                        <div className="card-body">
                            <div ref={this.deathsChartRef}
                                 className="timeline-chart"
                                 style={styles.chart}/>
                        </div>
                    </div>
                    <div className="card" style={{marginTop: "1rem"}}>
                        <div className="card-header">
                            Total Recovered
                        </div>
                        <div className="card-body">
                            <div ref={this.recoveredChartRef}
                                 className="timeline-chart"
                                 style={styles.chart}/>
                        </div>
                    </div>
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
                </div>
            </React.Fragment>
        )
    }

    componentDidMount() {
        this.getCharts();
    }

    getCharts() {
        this.setState({fetching: true});

        const query = gql`
            query {
                region(where: {name: {_eq: "World"}}) {
                    population_time_series
                    covid_confirmed_time_series
                    covid_deaths_time_series
                    covid_recovered_time_series
                }
            }
        `;

        const variables = {};

        try {
            fetch(query, variables).then(response => {
                console.assert(response && response.data && response.data.region, response);
                this.setState({fetching: false});
                this.renderCharts(response.data.region[0]);
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

        const casesTimeSeries = JSON.parse(data['covid_confirmed_time_series'])
        const deathsTimeSeries = JSON.parse(data['covid_deaths_time_series'])
        const recoveredTimeSeries = JSON.parse(data['covid_recovered_time_series'])
        const populationTimeSeries = JSON.parse(data['population_time_series'])

        this.renderConfirmedChart(casesTimeSeries, startDate, endDate, timeFormat, labelWidth);
        this.renderDailyConfirmedChart(casesTimeSeries, startDate, endDate, timeFormat, labelWidth);
        this.renderDeathsChart(deathsTimeSeries, startDate, endDate, timeFormat, labelWidth);
        this.renderDailyDeathsChart(deathsTimeSeries, startDate, endDate, timeFormat, labelWidth);
        this.renderRecoveredChart(recoveredTimeSeries, startDate, endDate, timeFormat, labelWidth);
        this.renderPopulationChart(populationTimeSeries, new Date('1960'),
            new Date(endDate.getYear() + 1900, 0), '%Y', labelWidth);
    }

    renderConfirmedChart(timeSeries, startDate, endDate, timeFormat, labelWidth) {
        const chart = $(this.casesChartRef.current);
        const plot = getPlot(startDate, timeSeries, addDays);
        renderChart(0, plot, timeFormat, labelWidth, timeSeries, chart, startDate, endDate);
    }

    renderDailyConfirmedChart(timeSeries, startDate, endDate, timeFormat, labelWidth) {
        const chart = $(this.dailyCasesChartRef.current);
        const plot = getBarPlot(startDate, timeSeries, addDays);
        renderBarChart(0, plot, timeFormat, labelWidth, timeSeries, chart, startDate, endDate);
    }

    renderDeathsChart(timeSeries, startDate, endDate, timeFormat, labelWidth) {
        const chart = $(this.deathsChartRef.current);
        const plot = getPlot(startDate, timeSeries, addDays);
        renderChart(0, plot, timeFormat, labelWidth, timeSeries, chart, startDate, endDate);
    }

    renderDailyDeathsChart(timeSeries, startDate, endDate, timeFormat, labelWidth) {
        const chart = $(this.dailyDeathsChartRef.current);
        const plot = getBarPlot(startDate, timeSeries, addDays);
        renderBarChart(0, plot, timeFormat, labelWidth, timeSeries, chart, startDate, endDate);
    }

    renderRecoveredChart(timeSeries, startDate, endDate, timeFormat, labelWidth) {
        const chart = $(this.recoveredChartRef.current);
        const plot = getPlot(startDate, timeSeries, addDays);
        renderChart(0, plot, timeFormat, labelWidth, timeSeries, chart, startDate, endDate);
    }

    renderPopulationChart(timeSeries, startDate, endDate, timeFormat, labelWidth) {
        const chart = $(this.populationChartRef.current);
        const plot = getPlot(startDate, timeSeries, addYears);
        renderChart(0, plot, timeFormat, labelWidth, timeSeries, chart, undefined, endDate);
    }
}

const styles = {
    chart: {
        width: "100%",
        height: "300px"
    }
};

export default WorldCharts;
