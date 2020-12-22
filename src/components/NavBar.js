import React from "react";
import {Link} from "react-router-dom";
import Constants from "../constants";

class NavBar extends React.Component {

    render() {
        return (
            <nav className="navbar fixed-top navbar-expand-lg navbar-light" style={styles.root}>
                <Link to="/" className="navbar-brand">
                    <img src="/images/logo.png" width="30" height="30" alt=""/>
                    <span style={{marginLeft: '8px'}}>{Constants.siteName}</span>
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">

                    </ul>
                    <div className="form-inline my-2 my-lg-0">
                        <div style={{marginRight: "10px"}}>

                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

const styles = {
    root: {
        borderBottom: "1px solid #dee2e6"
    }
};

export default NavBar;
