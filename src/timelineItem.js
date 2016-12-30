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
        flexDirection: 'column',
        marginVertical: 20,
        marginHorizontal: 50,
    },
    body: {
        paddingLeft: 20,
        marginLeft: 20,
        paddingVertical: 10,
        marginVertical: 5,
        borderLeftWidth: 1,
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    date: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontWeight: 'bold',
    },
});

const TimelineItem = observer(
class TimelineItem extends Component {
    render() {
        let visit = this.props.visit || {};
        return (
            <TouchableOpacity onPress={this.onPress}>
                <View key={visit.id} style={styles.container}>
                    <View style={styles.date}>
                        {this.renderArrivalDeparture(visit.departureDate)}
                    </View>
                    <View style={styles.body}>
                        <View>
                            <Text>{visit.latlng.latitude}, {visit.latlng.longitude}</Text>
                            {this.renderDuration(visit)}
                        </View>
                        <TouchableOpacity onPress={this.onRemove}>
                            <View><Text style={{color: 'red'}}>Remove</Text></View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.date}>
                        {this.renderArrivalDeparture(visit.arrivalDate)}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    renderArrivalDeparture = (date, bold) => {
        return <Text style={styles.title}>{date ? date.calendar() : "Unknown"}</Text>;
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

export default TimelineItem;