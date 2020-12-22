import React from "react";
import Constants from "../constants";
import Spinner from "./Spinner";

class LoadingScreen extends React.Component {

    render() {
        return (
            <React.Fragment>
                <div className="loading-screen" style={styles.root}/>
                <div className="loading-screen" style={styles.contentBlanker}/>
                <div className="loading-screen" style={styles.spinnerContainer}>
                    <div className="center-screen">
                        <Spinner/>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const styles = {
    root: {
        position: "absolute",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        zIndex: 99999,
        width: "100vw",
        height: "100vh",
        opacity: 0.5,
        display: "none"
    },
    contentBlanker: {
        position: "absolute",
        top: `${Constants.headerHeight}px`,
        left: 0,
        margin: 0,
        padding: 0,
        zIndex: 99999,
        width: "100vw",
        height: `calc(100vh - ${Constants.headerHeight + Constants.footerHeight}px)`,
        backgroundColor: "#FFF",
        opacity: 0.9,
        display: "none"
    },
    spinnerContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        zIndex: 99999,
        width: "100vw",
        height: "100vh",
        display: "none"
    }
};

export default LoadingScreen;
