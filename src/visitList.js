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

import VisitListItem from './visitListItem';

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        width: screen.width,
        backgroundColor: '#F5FCFF',
    },
});

const VisitList = observer(
class VisitList extends Component {
    render() {
        let visits = this.props.visits || [];
        return (
            <ScrollView style={styles.container}>
            {
                visits.map(visit =>
                    <VisitListItem key={visit.id}
                                visit={visit}
                                onListItemPressed={this.props.onListItemPressed}
                                onListItemRemove={this.props.onListItemRemove} />)
            }
            </ScrollView>
        );
    }
});

export default VisitList;

