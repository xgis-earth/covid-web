import React from "react";
import {connect} from "react-redux";

class WorldSummary extends React.Component {

    render() {
        if (!this.props.worldInfo) {
            return <React.Fragment/>
        }

        const rows = [];

        const addRow = (title, value) => {
            const headStyle = rows.length === 0 ? styles.thNoTop : styles.th;
            const cellStyle = rows.length === 0 ? styles.tdNoTop : {};
            rows.push(
                <tr key={rows.length}>
                    <th style={headStyle} scope="row">{title}</th>
                    <td style={cellStyle}>{value}</td>
                </tr>
            )
        };

        addRow('World Population', this.props.worldInfo['population'].toLocaleString());
        addRow('Covid Cases', this.props.worldInfo['covid_confirmed'].toLocaleString());
        addRow('Covid Deaths', this.props.worldInfo['covid_deaths'].toLocaleString());
        addRow('Covid Recovered', this.props.worldInfo['covid_recovered'].toLocaleString());

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
    worldInfo: state.globe.worldInfo,
});

const mapReduxDispatchToProps = (/*dispatch*/) => ({
    // Not used
});

export default connect(
    mapReduxStateToProps,
    mapReduxDispatchToProps
)(WorldSummary);
