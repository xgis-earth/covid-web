import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import LoadingScreen from "./LoadingScreen";
import NavBar from "./NavBar";
import Globe from "./Globe";
import Footer from "./Footer";

class App extends React.Component {

    render() {
        return (
            <ErrorBoundary>
                <LoadingScreen/>
                <NavBar/>
                <Globe/>
                <Footer/>
            </ErrorBoundary>
        )
    }
}

export default App;
