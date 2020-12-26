import $ from "jquery";
import React from "react";
import "flot-latest";
import "flot-latest/jquery.flot.time";
import "flot-latest/jquery.flot.resize";
import gql from "graphql-tag";
import Spinner from "./Spinner";
import {fetch} from "../graphql_fetch";
import {hideLoading} from "../functions";
import Constants from "../constants";

class WorldCharts extends React.Component {

    casesChartRef = React.createRef();
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
        const start = new Date('2020-01-22');
        const timeFormat = '%d %b';
        const labelWidth = Constants.chartsYLabelWidth;
        const deathsTimeSeries = JSON.parse(data['covid_deaths_time_series'])
        this.renderConfirmedChart(JSON.parse(data['covid_confirmed_time_series']), start, timeFormat, labelWidth);
        this.renderDeathsChart(deathsTimeSeries, start, timeFormat, labelWidth);
        this.renderDailyDeathsChart(deathsTimeSeries, start, timeFormat, labelWidth);
        this.renderRecoveredChart(JSON.parse(data['covid_recovered_time_series']), start, timeFormat, labelWidth);
        this.renderPopulationChart(JSON.parse(data['population_time_series']), new Date('1960'), '%Y', labelWidth);
    }

    renderConfirmedChart(timeSeries, start, timeFormat, labelWidth) {
        const chart = $(this.casesChartRef.current);
        this.renderChart(start, 0, addDays, timeFormat, labelWidth, timeSeries, chart, 'Cases');
    }

    renderDeathsChart(timeSeries, start, timeFormat, labelWidth) {
        const chart = $(this.deathsChartRef.current);
        this.renderChart(start, 0, addDays, timeFormat, labelWidth, timeSeries, chart, 'Deaths');
    }

    renderDailyDeathsChart(timeSeries, start, timeFormat, labelWidth) {
        const chart = $(this.dailyDeathsChartRef.current);
        this.renderBarChart(start, 0, addDays, timeFormat, labelWidth, timeSeries, chart, 'Daily Death Totals');
    }

    renderRecoveredChart(timeSeries, start, timeFormat, labelWidth) {
        const chart = $(this.recoveredChartRef.current);
        this.renderChart(start, 0, addDays, timeFormat, labelWidth, timeSeries, chart, 'Recovered');
    }

    renderPopulationChart(timeSeries, start, timeFormat, labelWidth) {
        const chart = $(this.populationChartRef.current);
        this.renderChart(start, undefined, addYears, timeFormat, labelWidth, timeSeries, chart, 'Population');
    }

    renderChart(start, min, timeIncrement, timeFormat, labelWidth, timeSeries, chart, title) {
        const len = timeSeries.length;

        const plot = [];
        for (let i = 0; i < len; i++) {
            const date = timeIncrement(start, i);
            plot.push([date, timeSeries[i]]);
        }

        $.plot(chart, [{
            label: title,
            data: plot
        }], {
            legend: {
                show: false
            },
            yaxis: {
                labelWidth,
                min,
                tickDecimals: 0,
                tickFormatter
            },
            xaxis: {
                mode: 'time',
                timeformat: timeFormat
            }
        });
    }

    renderBarChart(start, min, timeIncrement, timeFormat, labelWidth, timeSeries, chart, title) {
        const len = timeSeries.length;

        const plot = [];
        let prevTotal = 0;
        for (let i = 0; i < len; i++) {
            const date = timeIncrement(start, i);
            const today = timeSeries[i] - prevTotal;
            plot.push([date, today]);
            prevTotal = timeSeries[i];
        }

        $.plot(chart, [{
            label: title,
            data: plot,
            bars: {
                show: true,
                fill: true,
            }
        }], {
            legend: {
                show: false
            },
            bars: {
                barWidth: 24 * 60 * 60 * 600,
            },
            yaxis: {
                labelWidth,
                min,
                tickDecimals: 0,
                tickFormatter
            },
            xaxis: {
                mode: 'time',
                timeformat: timeFormat
            }
        });
    }
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function addYears(date, years) {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
}

function tickFormatter(n) {
    return Math.floor(n).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
}

const styles = {
    chart: {
        width: "100%",
        height: "300px"
    }
};

export default WorldCharts;
