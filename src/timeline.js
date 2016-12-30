import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    TouchableHighlight
} from 'react-native';
import { observer } from 'mobx-react/native';

import TimelineItem from './timelineItem';

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        width: screen.width,
        backgroundColor: '#F5FCFF',
    },
});

const Timeline = observer(
class Timeline extends Component {
    render() {
        let visits = this.props.visits || [];
        return (
            <ScrollView style={styles.container}>
            {
                visits.map(visit =>
                    <TimelineItem key={visit.id}
                                visit={visit}
                                onListItemPressed={this.props.onListItemPressed}
                                onListItemRemove={this.props.onListItemRemove} />)
            }
            </ScrollView>
        );
    }
});

export default Timeline;

