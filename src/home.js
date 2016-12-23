import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    NativeModules,
    NativeEventEmitter,
    TouchableHighlight,
    ScrollView,
    Dimensions,
} from 'react-native';
import MapView from 'react-native-maps';
import { observer } from 'mobx-react/native';
import { generate } from 'shortid';

import Visit from './visit';
import Store from './store';
import VisitList from './visitList';

const GeofenceEvents = new NativeEventEmitter(NativeModules.Geofence);
const Geofence = {
    TRIGGERED: "GeofenceTriggered",
    DIDVISIT: "DidVisit",
};
const geolocationParams = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000
};

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});

const Home = observer(
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialPosition: null,
            currentPosition: { latitude: 49.2827, longitude: -123.1207}
        };
        this.watchID = null;
    }
    componentDidMount() {
        this.visitListener = GeofenceEvents.addListener("DidVisit", (data) => {
            console.log(data);
            alert(JSON.stringify(data));
            data["id"] = generate();
            data["name"] = "visit";
            Store.add(new Visit(data));
        });

        navigator.geolocation.getCurrentPosition(
            (position) => this.setState({ initialPosition: this.getCoordinates(position) }),
            this.onPositionFailed,
            geolocationParams);
        this.watchID = navigator.geolocation.watchPosition(
            (position) => this.setState({ currentPosition: this.getCoordinates(position) }),
            this.onPositionFailed,
            geolocationParams);
    }

    componentWillUnmount() {
        if (this.visitListener) { this.visitListener.remove(); }
        if (this.watchID) { navigator.geolocation.clearWatch(this.watchID); }
    }

    render() {
        let { initialPosition, currentPosition } = this.state;
        let initPosText = "Initial: " + (initialPosition ? `${initialPosition.latitude}, ${initialPosition.longitude}` : "unknown");
        let currPosText = "Current: " + (currentPosition ? `${currentPosition.latitude}, ${currentPosition.longitude}` : "unknown");
        return (
            <View style={styles.container}>
                <View>
                    <Text>{initPosText}</Text>
                    <Text>{currPosText}</Text>
                </View>
                <TouchableHighlight onPress={this.addVisit}>
                    <View><Text>Add visit</Text></View>
                </TouchableHighlight>
                <VisitList style={{flex: 1}} visits={Store.visits} onListItemPress={this.removeVisit} />
                <MapView style={{flex: 3, width: screen.width}} initialRegion={{
                    latitude: currentPosition.latitude,
                    longitude: currentPosition.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}/>
            </View>
        );
    }

    addVisit = () => {
        Store.add(new Visit({id: generate(), name: "testing" }));
    }

    removeVisit = (visit) => {
        Store.remove(visit.id);
    }

    onPositionFailed = (error) => {
        alert(JSON.stringify(error));
    }

    getCoordinates = (position) => {
        return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
    }
});

export default Home;