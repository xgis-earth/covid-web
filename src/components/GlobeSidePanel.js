import $ from "jquery";
import React from "react";
import PropTypes from "prop-types";
import {Route, Switch, withRouter} from "react-router-dom";
import Country from "./Country";
import World from "./World";
import NotFound from "./NotFound";

class GlobeSidePanel extends React.Component {

    static propTypes = {
        scrollId: PropTypes.string.isRequired
    };

    render() {
        return (
            <Switch>
                <Route path="/country/:code" render={({match}) =>
                    <Country countryCode={match.params.code}/>
                }/>
                <Route path="/" render={() =>
                    <World/>
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
