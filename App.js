import React from 'react';
import { StyleSheet, Text, View, Button,
  ActivityIndicator, ListView, TextInput,
  Picker, RefreshControl } from 'react-native';
import moment from 'moment';
import PostList from './components/PostList';
import Pickers from './components/Pickers';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      time: 1000,
      limit: 10,
      account: 'MassRelDemo',
      stream: 'kindle',
      error: null
    }
  }

  componentDidMount(){
    this.fetchData()
  }

  pullFetch = () => {
    this.setState({ isLoading: true })
    this.fetchData()
  }

  fetchData = () => {
    const limit = this.state.limit
    const account = this.state.account
    const stream = this.state.stream
    const api = `http://api.massrelevance.com/${account}/${stream}.json`

    clearTimeout(this.fetchData)

    return fetch(`${api}?limit=${limit}`)
      .then( res => res.json() )
      .then( json => {
        console.log('json-------', json.length);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(json),
          error: null
        }, () => {
          // polling the api endpoint
          setTimeout(this.fetchData, this.state.time)
        });
      })
      .catch( err => {
        console.log('err---------', err);
        this.setState({
          error: 'Could not find the account or stream'
        })
      })
  }

  changeAccount = () => {
    console.log('changeAccount', this.state.account, this.state.stream);
    this.fetchData()
  }

  reset = () => {
    this.setState({
      account: 'MassRelDemo',
      stream: 'kindle',
    }, this.fetchData )
  }

  handlePickerTime = (itemValue, itemIndex) => {
    this.setState({time: itemValue})
  }
  handlePickerLimit = (itemValue, itemIndex) => {
    this.setState({limit: itemValue}, this.fetchData)
  }

  render() {
    return (
      <View style={{flex: 1, paddingTop: 20, flexDirection: 'column'}}>
        <View style={{backgroundColor: 'white', width: '80%'}}>
          <Text style={{fontSize: 16, fontStyle: 'italic'}}>
            {this.state.limit} recent posts from {this.state.account} - {this.state.stream}
          </Text>
          <Text> Change account and Stream name</Text>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              placeholder='Account'
              clearTextOnFocus={true}
              style={styles.inputs}
              onChangeText={(text) => this.setState({account: text})}
              onSubmitEditing={ this.changeAccount }
              value={this.state.account}
            />
            <TextInput
              placeholder='Stream Name'
              clearTextOnFocus={true}
              style={styles.inputs}
              onChangeText={(text) => this.setState({stream: text})}
              onSubmitEditing={ this.changeAccount }
              value={this.state.stream}
            />
            <Button
              onPress={ this.reset }
              title="Reset"
              color="#841584"
              accessibilityLabel="Reset to initial state"
            />
          </View>
        </View>

        <Text style={{color: 'red'}}>
          { this.state.error && this.state.error}
        </Text>

        {
          this.state.isLoading ?
          <View style={{flex: 1, paddingTop: 20}}>
            <ActivityIndicator />
          </View>
        :
          <PostList
            pullFetch={this.pullFetch}
            fetchData={this.fetchData}
            {...this.state} />
        }

        <Pickers
          handlePickerTime={this.handlePickerTime}
          handlePickerLimit={this.handlePickerLimit}
          {...this.state}/>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: {
    padding: 10
  },

  messageUser: {
    color: '#ccc'
  },

  inputs: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '50%',
    padding: 10
  }
});
