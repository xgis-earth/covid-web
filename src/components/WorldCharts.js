import $ from "jquery";
import React from "react";
import {connect} from "react-redux";
import "flot-latest";
import "flot-latest/jquery.flot.time";
import "flot-latest/jquery.flot.resize";

class WorldCharts extends React.Component {

    casesChartRef = React.createRef();
    deathsChartRef = React.createRef();
    dailyDeathsChartRef = React.createRef();
    recoveredChartRef = React.createRef();

    render() {
        const cases = parseInt(this.props.worldInfo['covid_confirmed']);
        const deaths = parseInt(this.props.worldInfo['covid_deaths']);
        const recovered = parseInt(this.props.worldInfo['covid_recovered']);

        return (
            <React.Fragment>
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
            </React.Fragment>
        )
    }

    componentDidMount() {
        const start = new Date('2020-01-22');
        const labelWidth = 65;

        const tickFormatter = (n) => Math.floor(n).toString()
            .replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");

        const addDays = (date, days) => {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        };

        let days;

        if (this.casesChartRef.current) {
            const timeSeries = JSON.parse(this.props.worldInfo['covid_confirmed_time_series']);
            const chart = $(this.casesChartRef.current);
            days = timeSeries.length;

            const plot = [];
            for (let i = 0; i < days; i++) {
                const date = addDays(start, i);
                plot.push([date, timeSeries[i]]);
            }

            $.plot(chart, [{
                label: 'Cases',
                data: plot
            }], {
                legend: {
                    show: false
                },
                yaxis: {
                    labelWidth,
                    min: 0,
                    tickDecimals: 0,
                    tickFormatter
                },
                xaxis: {
                    mode: 'time',
                    timeformat: '%d %b'
                }
            });
        }

        if (this.deathsChartRef.current) {
            const timeSeries = JSON.parse(this.props.worldInfo['covid_deaths_time_series']);
            const chart = $(this.deathsChartRef.current);
            days = timeSeries.length;

            const plot = [];
            for (let i = 0; i < days; i++) {
                const date = addDays(start, i);
                plot.push([date, timeSeries[i]]);
            }

            $.plot(chart, [{
                label: 'Deaths',
                data: plot
            }], {
                legend: {
                    show: false
                },
                yaxis: {
                    labelWidth,
                    min: 0,
                    tickDecimals: 0,
                    tickFormatter
                },
                xaxis: {
                    mode: 'time',
                    timeformat: '%d %b',
                }
            });
        }

        if (this.dailyDeathsChartRef.current) {
            const timeSeries = JSON.parse(this.props.worldInfo['covid_deaths_time_series']);
            const chart = $(this.dailyDeathsChartRef.current);
            days = timeSeries.length;

            const plot = [];
            let prevTotal = 0;
            for (let i = 0; i < days; i++) {
                const date = addDays(start, i);
                const today = timeSeries[i] - prevTotal;
                plot.push([date, today]);
                prevTotal = timeSeries[i];
            }

            $.plot(chart, [{
                label: 'Daily Death Totals',
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
                    min: 0,
                    tickDecimals: 0,
                    tickFormatter
                },
                xaxis: {
                    mode: 'time',
                    timeformat: '%d %b',
                }
            });
        }

        if (this.recoveredChartRef.current) {
            const timeSeries = JSON.parse(this.props.worldInfo['covid_recovered_time_series']);
            const chart = $(this.recoveredChartRef.current);
            days = timeSeries.length;

            const plot = [];
            for (let i = 0; i < days; i++) {
                const date = addDays(start, i);
                plot.push([date, timeSeries[i]]);
            }

            $.plot(chart, [{
                label: 'Recovered',
                data: plot
            }], {
                legend: {
                    show: false
                },
                yaxis: {
                    labelWidth,
                    min: 0,
                    tickDecimals: 0,
                    tickFormatter
                },
                xaxis: {
                    mode: 'time',
                    timeformat: '%d %b'
                }
            });
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
    worldInfo: state.globe.worldInfo,
});

const mapReduxDispatchToProps = (/*dispatch*/) => ({
    // Not used
});

export default connect(
    mapReduxStateToProps,
    mapReduxDispatchToProps
)(WorldCharts);
