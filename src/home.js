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

import { observer } from 'mobx-react/native';
import { generate } from 'shortid';

import Visit from './visit';
import Store from './store';
import VisitList from './visitList';
import VisitMap from './visitMap';

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
const Vancouver = { latitude: 49.2827, longitude: -123.1207};

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    visitList: {
        flex: 1,
        marginTop: 10,
    },
    visitMap: {
        flex: 2,
    },
});

const Home = observer(
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialPosition: null,
            currentPosition: Vancouver
        };
        this.watchID = null;
    }
    componentDidMount() {
        this.visitListener = GeofenceEvents.addListener("DidVisit", (data) => {
            console.log(data);
            alert(JSON.stringify(data));
            data["id"] = generate();
            data["name"] = "visit";
            data["latlng"] = { latitude: data.latitude, longitude: data.longitude };
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
                <TouchableHighlight style={{marginTop: 10, padding: 7, backgroundColor: "lightblue"}} onPress={this.addVisit}>
                    <View><Text>Add fake visit</Text></View>
                </TouchableHighlight>
                <View style={styles.visitList}>
                    <VisitList visits={Store.visits} onListItemPress={this.removeVisit} />
                </View>
                <View style={styles.visitMap}>
                    <VisitMap position={currentPosition} visits={Store.visits}/>
                </View>
            </View>
        );
    }

    addVisit = () => {
        Store.add(new Visit({
            id: generate(),
            name: "testing",
            latlng: {
                latitude: Vancouver.latitude + (Math.random() / 200),
                longitude: Vancouver.longitude + (Math.random() / 200)
            }
        }));
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