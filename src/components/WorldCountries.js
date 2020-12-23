import React from "react";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";

class WorldCountries extends React.Component {

    render() {
        if (!this.props.countries || !this.props.worldInfo) {
            return <React.Fragment/>
        }

        const tableData = [];

        for (const code in this.props.countries) {
            if (!this.props.countries.hasOwnProperty(code)) continue;

            const country = this.props.countries[code];
            if (country.additionalData) {
                const name = country.additionalData.name;
                const deaths = country.additionalData['covid_deaths'] || 0;
                const cases = country.additionalData['covid_confirmed'] || 0;
                if (deaths === 0 && cases === 0) continue; // Don't show rows with no data.
                tableData.push({code, name, deaths, cases});
            }
        }

        const columns = [
            {
                dataField: 'name',
                text: 'Country',
                sort: true,
                formatter: (cell, row) => <Link to={`/country/${row.code}`}>{cell}</Link>
            },
            {
                dataField: 'cases',
                text: 'Cases',
                sort: true,
                formatter: (cell) => cell ? cell.toLocaleString() : ''
            },
            {
                dataField: 'deaths',
                text: 'Deaths',
                sort: true,
                formatter: (cell) => cell ? cell.toLocaleString() : ''
            }
        ];

        return (
            <BootstrapTable bootstrap4
                            keyField="code"
                            data={tableData}
                            columns={columns}
                            defaultSorted={[{dataField: 'deaths', order: 'desc'}]}
                            classes="tab-first-bootstrap-table"/>
        )
    }
}

const mapReduxStateToProps = (state) => ({
    worldInfo: state.globe.worldInfo,
    countries: state.globe.countries,
    countryEntities: state.globe.countryEntities,
    cesiumRef: state.globe.cesiumRef,
});

const mapReduxDispatchToProps = (/*dispatch*/) => ({
    // Not used
});

export default connect(
    mapReduxStateToProps,
    mapReduxDispatchToProps
)(withRouter(WorldCountries));
