import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

class CountrySummary extends React.Component {

    static propTypes = {
        countryCode: PropTypes.string.isRequired, // Component attribute
        countries: PropTypes.object.isRequired, // Redux globe state
    };

    render() {
        const country = this.props.countries[this.props.countryCode];
        const properties = country.properties;
        const data = country.additionalData;

        const cases = data && data['covid_confirmed'];
        const deaths = data && data['covid_deaths'];
        const recovered = data && data['covid_recovered'];
        const tests = data && data['covid_tests'];

        const rows = [];

        const addRow = (name, value) => {
            const headStyle = rows.length === 0 ? styles.thNoTop : styles.th;
            const cellStyle = rows.length === 0 ? styles.tdNoTop : {};
            rows.push(
                <tr key={rows.length}>
                    <th style={headStyle} scope="row">{name}</th>
                    <td style={cellStyle}>{value}</td>
                </tr>
            )
        };

        addRow('Formal Name', properties['Formal']);
        addRow('Population', properties['Population'].toLocaleString());
        cases && addRow('Covid Cases', cases.toLocaleString());
        deaths && addRow('Covid Deaths', deaths.toLocaleString());
        recovered && addRow('Covid Recovered', recovered.toLocaleString());
        tests && addRow('Covid Tests', tests.toLocaleString());

        return (
            <table className="table">
                <tbody>
                {rows}
                </tbody>
            </table>
        )
    }
}

const styles = {
    th: {
        width: "160px",
    },
    thNoTop: {
        width: "160px",
        borderTop: 0,
    },
    tdNoTop: {
        borderTop: 0,
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
)(CountrySummary);
