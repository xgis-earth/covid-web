import $ from "jquery";
import React from "react";
import PropTypes from "prop-types";
import {Route, Switch, withRouter} from "react-router-dom";
import Country from "./Country";
import World from "./World";
import DataAttribution from "./DataAttribution";
import NotFound from "./NotFound";

class GlobeSidePanel extends React.Component {

    static propTypes = {
        scrollId: PropTypes.string.isRequired
    };

    render() {
        return (
            <Switch>
                <Route exact path="/(charts|countries|regions)?" render={() =>
                    <World/>
                }/>
                <Route path="/country/:code" render={({match}) =>
                    <Country countryCode={match.params.code}/>
                }/>
                <Route exact path="/data-sources" render={() =>
                    <DataAttribution/>
                }/>
                <Route render={() => (
                    <NotFound/>
                )}/>
            </Switch>
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location !== prevProps.location) {
            $(`#${this.props.scrollId}`).scrollTop(0);
        }
    }
}

export default withRouter(GlobeSidePanel);
