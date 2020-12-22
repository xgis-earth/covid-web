import React from "react";
import {hideLoading} from "../functions";

class ErrorBoundary extends React.Component {

    state = {hasError: false};

    static getDerivedStateFromError(_) {
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            hideLoading();
            return (
                <div className="page-margin">
                    There was a problem in rendering this page.
                </div>
            )
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
