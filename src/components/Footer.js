import React from "react";
import {Link} from "react-router-dom";

class Footer extends React.Component {

    render() {
        return (
            <div className="fixed-bottom" style={styles.footer}>
                <div style={styles.copyright}>
                    <Link to="/data">Data Attribution</Link>
                    &nbsp; | &nbsp;
                    <a href="https://xgis.earth">XGIS.Earth</a>
                </div>
            </div>
        )
    }
}

const styles = {
    footer: {
        backgroundColor: "#ffffff",
        borderTop: "solid 1px #dee2e6",
        padding: "1px 0 4px 8px",
        fontSize: "smaller"
    },
    copyright: {
        float: "right",
        paddingRight: "8px"
    }
};

export default Footer;
