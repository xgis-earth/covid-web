import $ from "jquery";
import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import "flot-latest";
import "flot-latest/jquery.flot.time";
import "flot-latest/jquery.flot.resize";
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

        cases = isNaN(cases) ? 0 : cases;
        deaths = isNaN(deaths) ? 0 : deaths;
        recovered = isNaN(recovered) ? 0 : recovered;
        tests = isNaN(tests) ? 0 : tests;

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
            </React.Fragment>
        )
    }

    componentDidMount() {
        this.updateChart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.countryCode !== prevProps.countryCode) {
            this.updateChart();
        }
    }

    updateChart() {
        const countries = this.props.countries;
        const country = countries[this.props.countryCode];
        const start = new Date('2020-01-22');
        const labelWidth = Constants.chartsYLabelWidth;

        const tickFormatter = (n) => Math.floor(n).toString()
            .replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");

        const addDays = (date, days) => {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        };

        let days;

        if (this.casesChartRef.current) {
            const timeSeries = JSON.parse(country.additionalData['covid_confirmed_time_series']);
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
                grid: {
                    // clickable: true
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
            const timeSeries = JSON.parse(country.additionalData['covid_deaths_time_series']);
            const chart = $(this.deathsChartRef.current);
            days = timeSeries.length;

            const deaths = [];
            for (let i = 0; i < days; i++) {
                const date = addDays(start, i);
                deaths.push([date, timeSeries[i]]);
            }

            $.plot(chart, [{
                label: 'Deaths',
                data: deaths
            }], {
                legend: {
                    show: false
                },
                grid: {
                    // clickable: true
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

        if (this.dailyDeathsChartRef.current) {
            const timeSeries = JSON.parse(country.additionalData['covid_deaths_time_series']);
            const chart = $(this.dailyDeathsChartRef.current);
            days = timeSeries.length;

            const deathsPlot = [];
            let maxDeaths = 0;
            let prevTotal = 0;
            for (let i = 0; i < days; i++) {
                const date = addDays(start, i);
                const today = timeSeries[i] - prevTotal;
                deathsPlot.push([date, today]);

                if (today > maxDeaths) maxDeaths = today;
                prevTotal = timeSeries[i];
            }

            $.plot(chart, [{
                label: 'Daily Death Totals',
                data: deathsPlot,
                bars: {
                    show: true,
                    fill: true,
                }
            }], {
                legend: {
                    show: false
                },
                grid: {
                    // hoverable: true,
                    // clickable: true
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
                    timeformat: '%d %b'
                }
            });
        }

        if (this.recoveredChartRef.current) {
            const timeSeries = JSON.parse(country.additionalData['covid_recovered_time_series']);
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
                grid: {
                    // clickable: true
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

        if (this.testsChartRef.current) {
            const timeSeries = JSON.parse(country.additionalData['covid_tests_time_series']);
            const chart = $(this.testsChartRef.current);

            const plot = [];
            for (let i = 0; i < timeSeries.length; i++) {
                const entry = timeSeries[i];
                plot.push([new Date(entry.date), entry.count]);
            }

            $.plot(chart, [{
                label: 'Tests',
                data: plot
            }], {
                legend: {
                    show: false
                },
                grid: {
                    // clickable: true
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
                    min: start,
                    max: (days ? addDays(start, days - 1) : undefined)
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
    countries: state.globe.countries,
});

const mapReduxDispatchToProps = (/*dispatch*/) => ({
    // Not used
});

export default connect(
    mapReduxStateToProps,
    mapReduxDispatchToProps
)(CountryCharts);
