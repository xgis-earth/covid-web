import $ from "jquery";
import "flot-latest";
import "flot-latest/jquery.flot.time";
import "flot-latest/jquery.flot.resize";
import {
    Cartesian3,
    Cartographic,
    HeadingPitchRange,
    Math as CesiumMath,
} from "cesium";

// -----------------------------------------------------------------------------
// Loading screen.
// -----------------------------------------------------------------------------

export function showLoading() {
    $('.loading-screen').css('display', '');
}

export function hideLoading() {
    $('.loading-screen').css('display', 'none');
}

// -----------------------------------------------------------------------------
// Get entity.
// -----------------------------------------------------------------------------

export function getCountryEntity(code, entities) {
    const candidates = [];
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        if (entity.properties['ISO Alpha-2']?.getValue() === code) {
            candidates.push(entity);
        }
    }

    let top = 0;
    let result = undefined;
    for (let i = 0; i < candidates.length; i++) {
        const poly = candidates[i].polygon;
        const positions = poly.hierarchy.getValue().positions;
        if (positions.length > top) {
            top = positions.length;
            result = candidates[i];
        }
    }

    return result;
}

// -----------------------------------------------------------------------------
// Show entity.
// -----------------------------------------------------------------------------

export function showCountry(code, entities, cesiumElement) {
    const entity = getCountryEntity(code, entities);
    showEntity(entity, cesiumElement);
}

function getDestination(entity, height) {
    const entityPosition = entity.position.getValue(0);
    const entityDegrees = Cartographic.fromCartesian(entityPosition);
    const latitude = entityDegrees.latitude;
    const longitude = entityDegrees.longitude;
    return Cartesian3.fromRadians(longitude, latitude, height);
}

export function showEntity(entity, cesiumElement) {
    if (entity.position) {
        const destination = getDestination(entity, 1000);
        cesiumElement.camera.flyTo({destination});
    } else {
        const pitch = new HeadingPitchRange(0, CesiumMath.toRadians(-90.0), 0);
        cesiumElement.flyTo(entity, {offset: pitch});
    }
}

export function* showEntityAsync(entity, cesiumElement) {
    if (entity.position) {
        const destination = getDestination(entity, 1000);
        yield cesiumElement.camera.setView({destination});
    } else {
        const pitch = new HeadingPitchRange(0, CesiumMath.toRadians(-90.0), 0);
        yield cesiumElement.flyTo(entity, {offset: pitch});
    }
}

// -----------------------------------------------------------------------------
// Charts
// -----------------------------------------------------------------------------

export function renderChart(min, plot, timeFormat, labelWidth, timeSeries, chart) {
    $.plot(chart, [{
        data: plot
    }], {
        legend: {
            show: false
        },
        yaxis: {
            labelWidth,
            min,
            tickDecimals: 0,
            tickFormatter
        },
        xaxis: {
            mode: 'time',
            timeformat: timeFormat
        }
    });
}

export function renderBarChart(min, plot, timeFormat, labelWidth, timeSeries, chart) {
    $.plot(chart, [{
        data: plot,
        bars: {
            show: true,
            fill: true,
        }
    }], {
        legend: {
            show: false
        },
        bars: {
            barWidth: 24 * 60 * 60 * 600,
        },
        yaxis: {
            labelWidth,
            min,
            tickDecimals: 0,
            tickFormatter
        },
        xaxis: {
            mode: 'time',
            timeformat: timeFormat
        }
    });
}

export function getPlot(start, timeSeries, timeIncrement) {
    const len = timeSeries.length;
    const plot = [];

    for (let i = 0; i < len; i++) {
        const date = timeIncrement(start, i);
        plot.push([date, timeSeries[i]]);
    }

    return plot;
}

export function getBarPlot(start, timeSeries, timeIncrement) {
    const len = timeSeries.length;
    const plot = [];

    let prevTotal = 0;
    for (let i = 0; i < len; i++) {
        const date = timeIncrement(start, i);
        const today = timeSeries[i] - prevTotal;
        plot.push([date, today]);
        prevTotal = timeSeries[i];
    }

    return plot;
}

export function getPlotFromTimestampedSeries(timeSeries) {
    const plot = [];

    for (let i = 0; i < timeSeries.length; i++) {
        const entry = timeSeries[i];
        plot.push([new Date(entry.date), entry.count]);
    }

    return plot;
}

export function getBarPlotFromTimestampedSeries(timeSeries) {
    const plot = [];

    let prevTotal = 0;
    for (let i = 0; i < timeSeries.length; i++) {
        const entry = timeSeries[i];
        const today = entry.count - prevTotal;
        plot.push([new Date(entry.date), today]);
        prevTotal = entry.count;
    }

    return plot;
}

export function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function addYears(date, years) {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
}

export function tickFormatter(n) {
    return Math.floor(n).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
}
