import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { toJS } from 'mobx';
import { observer } from 'mobx-react/native';
import Moment from 'moment';

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        marginHorizontal: 10,
    },
    title: {
        fontWeight: "bold"
    },
    right: {
        backgroundColor: 'red',
    }
});

const VisitListItem = observer(
class VisitListItem extends Component {
    render() {
        let visit = this.props.visit || {};
        return (
            <View key={visit.id} style={styles.container}>
                <TouchableOpacity onPress={this.onPress}>
                    <View>
                        <Text style={styles.title}>{visit.id} - {visit.name}</Text>
                        <Text>{visit.latlng.latitude}, {visit.latlng.longitude}</Text>
                        {this.renderArrivalDeparture("Arrival", visit.arrivalDate)}
                        {this.renderArrivalDeparture("Departure", visit.departureDate)}
                        {this.renderDuration(visit)}
                    </View>
                </TouchableOpacity>
                <View>
                    <TouchableOpacity onPress={this.onRemove}>
                        <View><Text>Remove</Text></View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    renderArrivalDeparture = (text, date) => {
        return date ? <Text>{text}: {date.calendar()}</Text> : null;
    }

    renderDuration = (visit) => {
        return visit.duration ?
            <Text>Duration: {Moment.duration(visit.duration).humanize()}</Text> : null;
    }

    onPress = () => {
        if (this.props.onListItemPressed) {
            this.props.onListItemPressed(this.props.visit);
        }
    }

    onRemove = () => {
        if (this.props.onListItemRemove) {
            this.props.onListItemRemove(this.props.visit);
        }
    }
});

export default VisitListItem;