import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    NativeModules,
    NativeEventEmitter,
    TouchableHighlight,
    ScrollView,
} from 'react-native';
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
    componentDidMount() {
        this.visitListener = GeofenceEvents.addListener("DidVisit", (data) => {
            console.log(data);
            alert(JSON.stringify(data));
            data["id"] = generate();
            data["name"] = "visit";
            Store.add(new Visit(data));
        });
    }

    componentWillUnmount() {
        if (this.visitListener) { this.visitListener.remove(); }
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight onPress={this.addVisit}>
                    <View><Text>Add visit</Text></View>
                </TouchableHighlight>
                <VisitList visits={Store.visits} onListItemPress={this.removeVisit} />
            </View>
        );
    }

    addVisit = () => {
        Store.add(new Visit({id: generate(), name: "testing" }));
    }

    removeVisit = (visit) => {
        Store.remove(visit.id);
    }
});

export default Home;