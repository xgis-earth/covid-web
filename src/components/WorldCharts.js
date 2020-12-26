import $ from "jquery";
import React from "react";
import {connect} from "react-redux";
import "flot-latest";
import "flot-latest/jquery.flot.time";
import "flot-latest/jquery.flot.resize";
import Constants from "../constants";

class WorldCharts extends React.Component {

    casesChartRef = React.createRef();
    deathsChartRef = React.createRef();
    dailyDeathsChartRef = React.createRef();
    recoveredChartRef = React.createRef();
    populationChartRef = React.createRef();

    render() {
        if (!this.props.worldInfo) {
            return <React.Fragment/>
        }

        return (
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
            </React.Fragment>
        )
    }

    componentDidMount() {
        if (this.props.worldInfo) {
            this.renderCharts(this.props.worldInfo);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.renderCharts(this.props.worldInfo);
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

    renderConfirmedChart(data, start, timeFormat, labelWidth) {
        const timeSeries = JSON.parse(data['covid_confirmed_time_series']);
        const chart = $(this.casesChartRef.current);
        this.renderChart(start, 0, addDays, timeFormat, labelWidth, timeSeries, chart, 'Cases');
    }

    renderDeathsChart(data, start, timeFormat, labelWidth) {
        const timeSeries = JSON.parse(data['covid_deaths_time_series']);
        const chart = $(this.deathsChartRef.current);
        this.renderChart(start, 0, addDays, timeFormat, labelWidth, timeSeries, chart, 'Deaths');
    }

    renderDailyDeathsChart(data, start, timeFormat, labelWidth) {
        const timeSeries = JSON.parse(data['covid_deaths_time_series']);
        const chart = $(this.dailyDeathsChartRef.current);
        this.renderBarChart(start, 0, addDays, timeFormat, labelWidth, timeSeries, chart, 'Daily Death Totals');
    }

    renderRecoveredChart(data, start, timeFormat, labelWidth) {
        const timeSeries = JSON.parse(data['covid_recovered_time_series']);
        const chart = $(this.recoveredChartRef.current);
        this.renderChart(start, 0, addDays, timeFormat, labelWidth, timeSeries, chart, 'Recovered');
    }

    renderPopulationChart(data, start, timeFormat, labelWidth) {
        const timeSeries = JSON.parse(data['population_time_series']);
        const chart = $(this.populationChartRef.current);
        this.renderChart(start, undefined, addYears, timeFormat, labelWidth, timeSeries, chart, 'Population');
    }

    renderCharts(data) {
        const start = new Date('2020-01-22');
        const timeFormat = '%d %b';
        const labelWidth = Constants.chartsYLabelWidth;
        this.renderConfirmedChart(data, start, timeFormat, labelWidth);
        this.renderDeathsChart(data, start, timeFormat, labelWidth);
        this.renderDailyDeathsChart(data, start, timeFormat, labelWidth);
        this.renderRecoveredChart(data, start, timeFormat, labelWidth);
        this.renderPopulationChart(data, new Date('1960'), '%Y', labelWidth);
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

const mapReduxStateToProps = (state) => ({
    worldInfo: state.globe.worldInfo,
});

const mapReduxDispatchToProps = (/*dispatch*/) => ({
    // Not used
});

export default connect(
    mapReduxStateToProps,
    mapReduxDispatchToProps
)(WorldCharts);
