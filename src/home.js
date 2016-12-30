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
const Vancouver = { latitude: 49.2827, longitude: -123.1207};

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    visitList: {
        flex: 1,
    },
    visitMap: {
        flex: 1,
    },
});

const Home = observer(
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focusLatlng: null
        }
    }
    componentDidMount() {
        this.visitListener = GeofenceEvents.addListener("DidVisit", (data) => {
            try {
                data["id"] = generate();
                data["name"] = "visit";
                data["latlng"] = { latitude: data.latitude, longitude: data.longitude };
                Store.add(new Visit(data));
            }
            catch (error) {
                alert(JSON.stringify(error));
            }
        });
    }

    componentWillUnmount() {
        if (this.visitListener) { this.visitListener.remove(); }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.visitMap}>
                    <VisitMap visits={Store.visits} focusLatlng={this.state.focusLatlng} />
                </View>
                <View style={styles.visitList}>
                    <VisitList visits={Store.visits}
                            onListItemPressed={this.inspectVisit}
                            onListItemRemove={this.removeVisit} />
                </View>
            </View>
        );
    }

    inspectVisit = (visit) => {
        this.setState({ focusLatlng: visit.latlng });
        // alert(JSON.stringify(visit));
    }

    removeVisit = (visit) => {
        Store.remove(visit.id);
    }
});

export default Home;