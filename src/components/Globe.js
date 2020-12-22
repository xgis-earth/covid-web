import React from "react";
import {useMediaQuery} from "react-responsive";
import Constants from "../constants";
import Cesium from "./Cesium";
import GlobeSidePanel from "./GlobeSidePanel";

class Globe extends React.Component {

    render() {
        return (
            <div className="row no-gutters">
                <Mobile>
                    <div className="col-md">
                        <Cesium style={styles.mobileGlobe}/>
                    </div>
                    <div id="globe-side-panel" className="col-md">
                        <GlobeSidePanel scrollId="globe-side-panel"/>
                    </div>
                </Mobile>
                <Default>
                    <div className="col-md">
                        <Cesium style={styles.defaultGlobe}/>
                    </div>
                    <div id="globe-side-panel" className="col-md" style={styles.defaultTabs}>
                        <GlobeSidePanel scrollId="globe-side-panel"/>
                    </div>
                </Default>
            </div>
        )
    }
}

const Mobile = ({children}) => {
    const isMobile = useMediaQuery({maxWidth: 767});
    return isMobile ? children : null;
};

const Default = ({children}) => {
    const isNotMobile = useMediaQuery({minWidth: 768});
    return isNotMobile ? children : null;
};

const styles = {
    mobileGlobe: {
        userSelect: 'none',
        height: 'calc(40vh)'
    },
    defaultGlobe: {
        userSelect: 'none',
        height: `calc(100vh - ${Constants.headerHeight + Constants.footerHeight}px)`,
        borderRight: 'solid 1px #dee2e6'
    },
    defaultTabs: {
        height: `calc(100vh - ${Constants.headerHeight + Constants.footerHeight}px)`,
        overflow: 'auto'
    }
};

export default Globe;
