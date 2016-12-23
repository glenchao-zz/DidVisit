import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    TouchableHighlight
} from 'react-native';
import { toJS } from 'mobx';
import { observer } from 'mobx-react/native';

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        width: screen.width,
        backgroundColor: '#F5FCFF',
    },
});

const VisitListItem = observer(
class VisitListItem extends Component {
    render() {
        let visit = this.props.visit || {};
        return (
            <TouchableHighlight key={visit.id} onPress={this.onPress}>
                <View>
                    <Text>{visit.id} - {visit.name}</Text>
                    <Text>{visit.latlng.latitude}, {visit.latlng.longitude}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    onPress = () => {
        if (this.props.onListItemPress) {
            this.props.onListItemPress(this.props.visit);
        }
    }
});

export default VisitListItem;