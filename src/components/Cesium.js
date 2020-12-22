import React from "react";
import {matchPath, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {
    Globe,
    ImageryLayer,
    Moon,
    Scene,
    ScreenSpaceCameraController,
    ScreenSpaceEvent,
    ScreenSpaceEventHandler,
    SkyAtmosphere,
    SkyBox,
    Viewer,
} from "resium";
import {
    Color,
    Ion,
    MapboxStyleImageryProvider,
    ScreenSpaceEventType,
} from "cesium";
import "cesium/Widgets/widgets.css";
import {
    getGlobeData,
    setSelectedEntity,
} from "../redux/actions/globe";
import Constants from "../constants";

class Cesium extends React.Component {

    cesiumRef = React.createRef();

    render() {

        // Options
        const backgroundColour = Color.WHITE;
        const globeColour = Color.ROYALBLUE;
        const showGroundAtmosphere = true;
        const showSkyAtmosphere = false;
        const showSkyBox = false;
        const showMoon = false;
        const showSurfaceImagery = true;
        const showSurfaceImageryPicker = true; // NOTE: Not active when useSingleImageryProvider is true.
        const showTimeline = false;
        const showTimelineControls = false;
        const showFullscreenButton = false;
        const showHomeButton = false;
        const showNavigationHelpButton = false;
        const showSceneModeOptions = false;
        const useSingleImageryProvider = true;

        // NOTE: This variable is used to avoid a double push on location for a duplicate event.
        let lastPush;

        return (
            <Viewer ref={this.cesiumRef}
                    style={this.props.style}
                    animation={showTimelineControls}
                    baseLayerPicker={showSurfaceImageryPicker && showSurfaceImagery && !useSingleImageryProvider}
                    fullscreenButton={showFullscreenButton}
                    homeButton={showHomeButton}
                    navigationHelpButton={showNavigationHelpButton}
                    imageryProvider={showSurfaceImagery ? undefined : false}
                    scene3DOnly={!showSceneModeOptions}
                    timeline={showTimeline}
                    infoBox={false}
                    geocoder={false}
                    selectedEntity={this.props.selectedEntity}
                    onSelectedEntityChange={entity => {
                        if (!entity) {
                            this.props.onSetSelectedEntity(null);
                            return;
                        }

                        const properties = {};
                        const propertyNames = entity.properties.propertyNames;
                        for (let i = 0; i < propertyNames.length; i++) {
                            const name = propertyNames[i];
                            properties[name] = entity.properties[name];
                        }

                        const countryCode = properties['ISO Alpha-2'];

                        // Maintain the same tab selection if we are already on a country page.
                        const match = matchPath(this.props.location.pathname, {
                            path: '/country/:code/:tab',
                            exact: true
                        });

                        let tab = match?.params.tab;
                        tab = tab ? `/${tab}` : '';

                        const location = `/country/${countryCode}${tab}`;
                        if (lastPush !== location) this.props.history.push(location);
                        lastPush = location;

                        this.props.onSetSelectedEntity(entity);
                    }}>
                <Scene backgroundColor={backgroundColour}/>
                <Globe baseColor={globeColour} showGroundAtmosphere={showGroundAtmosphere}/>
                <ScreenSpaceCameraController enableTilt={false}/>
                <ScreenSpaceEventHandler useDefault={true}>
                    <ScreenSpaceEvent type={ScreenSpaceEventType.LEFT_DOUBLE_CLICK}/>
                </ScreenSpaceEventHandler>
                <SkyBox show={showSkyBox}/>
                <SkyAtmosphere show={showSkyAtmosphere}/>
                <Moon show={showMoon}/>
                {useSingleImageryProvider &&
                <ImageryLayer imageryProvider={imageryProvider}/>
                }
            </Viewer>
        )
    }

    componentDidMount() {
        this.props.onGetGlobeData(this.cesiumRef);
    }
}

Ion.defaultAccessToken = Constants.ionToken;

const imageryProvider = new MapboxStyleImageryProvider({
    styleId: 'satellite-streets-v11',
    mapId: 'mapbox.streets-satellite',
    accessToken: Constants.mapboxToken
});

const mapReduxStateToProps = (state) => ({
    selectedEntity: state.globe.selectedEntity,
});

const mapReduxDispatchToProps = (dispatch) => ({
    onGetGlobeData: (cesiumRef) => dispatch(getGlobeData(cesiumRef)),
    onSetSelectedEntity: (entity) => dispatch(setSelectedEntity(entity)),
});

export default connect(
    mapReduxStateToProps,
    mapReduxDispatchToProps
)(withRouter(Cesium));
