import React from "react";

class DataAttribution extends React.Component {

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
                        <p className="card-text">COVID-19 Data Repository by the Center for Systems Science and
                            Engineering (CSSE) at Johns Hopkins University.</p>
                        <a href="https://github.com/CSSEGISandData/COVID-19" className="btn btn-primary">
                            Go to CSSEGISandData/COVID-19 on GitHub
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default DataAttribution;
