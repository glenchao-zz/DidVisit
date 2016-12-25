import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';
import { observer } from 'mobx-react/native';
import MapView from 'react-native-maps';

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
    map: {
        width: screen.width,
        flex: 1
    },
});

const VisitMap = observer(
class VisitMap extends Component {
    componentDidMount() {
        this.refs.map.fitToElements(true);
    }
    render() {
        let {
            visits,
        } = this.props;
        visits = visits.filter(visit => (visit.latlng && visit.latlng.latitude && visit.latlng.longitude));
        return (
            <MapView ref="map"
                    style={styles.map}
                    showsUserLocation={true}
                    showsMyLocationButton={true}>
            {visits.map(visit => {
                return <MapView.Marker key={visit.id}
                                identifier={visit.id}
                                coordinate={visit.latlng}
                                title={visit.name}
                                description={`${visit.id} ${visit.name}`} />
            })}
            </MapView>
        );
    }
});

export default VisitMap;