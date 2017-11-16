import React from 'react';
import { StyleSheet, Text, Picker, View,  } from 'react-native';

const timeInterval = [500, 1000, 1500, 2000];
const limits = [3, 10, 50, 100, 200]

export default class Pickers extends React.Component {
  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={{backgroundColor: 'white'}}>
          <Text> {this.props.time}ms update intervals </Text>
          <Picker
            style={styles.picker}
            selectedValue={this.props.time}
            onValueChange={ this.props.handlePickerTime } >
            { timeInterval.map( t => (
              <Picker.Item label={ `${t} sec` } value={ t }  key={t}/> //`
              ) )
            }
          </Picker>
        </View>

        <View style={{backgroundColor: 'white' }}>
          <Text> Displaying {this.props.limit} posts </Text>
          <Picker
            style={styles.picker}
            selectedValue={this.props.limit}
            onValueChange={ this.props.handlePickerLimit }
            >
            { limits.map( t => (
              <Picker.Item label={ "show " + t } value={ t }  key={t}/>
              ) )
            }
          </Picker>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  picker: {
    borderColor: '#ccc',
    borderWidth: 1,
  },
});


