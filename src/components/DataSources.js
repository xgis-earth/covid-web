import React from "react";

class DataSources extends React.Component {

    render() {
        return (
            <div style={{margin: "12px"}}>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active">Data Sources</li>
                    </ol>
                </nav>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">JHU CSSE COVID-19 Data</h5>
                        <p className="card-text">
                            COVID-19 Data Repository by the Center for Systems Science and
                            Engineering (CSSE) at Johns Hopkins University.
                        </p>
                        <a href="https://github.com/CSSEGISandData/COVID-19" className="btn btn-primary">
                            Go to CSSEGISandData/COVID-19 on GitHub
                        </a>
                    </div>
                </div>
                <div className="card mt-3">
                    <div className="card-body">
                        <h5 className="card-title">SARS-CoV-2 Test Tracker Data</h5>
                        <p className="card-text">
                            Test data collated everyday by the FIND team, from information found online.
                            Usually the official government websites of each country are consulted.
                        </p>
                        <a href="https://github.com/dsbbfinddx/FINDCov19TrackerData" className="btn btn-primary">
                            Go to dsbbfinddx/FINDCov19TrackerData on GitHub
                        </a>
                    </div>
                </div>
                <div className="card mt-3">
                    <div className="card-body">
                        <h5 className="card-title">Mediastack News API</h5>
                        <p className="card-text">
                            The mediastack API provides a REST API for real-time and historical news data.
                        </p>
                        <a href="https://mediastack.com" className="btn btn-primary">
                            Go to mediastack.com
                        </a>
                    </div>
                </div>
                <div className="card mt-3">
                    <div className="card-body">
                        <h5 className="card-title">COVID-19 Global Travel Restrictions and Airline Information</h5>
                        <p className="card-text">
                            Current travel & airline restrictions. Information is collected from various sources: IATA,
                            media, national sources, WFP internal or any other.
                        </p>
                        <a href="https://data.humdata.org/dataset/covid-19-global-travel-restrictions-and-airline-information" className="btn btn-primary">
                            Go to HDX (Humanitarian Data Exchange)
                        </a>
                    </div>
                </div>
                <div className="card mt-3">
                    <div className="card-body">
                        <h5 className="card-title">Data on COVID-19 (coronavirus) by Our World in Data</h5>
                        <p className="card-text">
                            Collection of COVID-19 data maintained by Our World in Data, updated daily.
                        </p>
                        <a href="https://ourworldindata.org/coronavirus" className="btn btn-primary">
                            Go to Our World in Data: Coronavirus Pandemic (COVID-19)
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default DataSources;
