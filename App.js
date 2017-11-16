import React from 'react';
import { StyleSheet, Text, View,
  ActivityIndicator, ListView,
  Picker, RefreshControl } from 'react-native';
import moment from 'moment';
import PostList from './components/PostList';

const timeInterval = [500, 1000, 1500, 2000];
const limits = [3, 10, 50, 100, 200]


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      time: 1000,
      limit: 10
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
    const api = 'http://api.massrelevance.com/MassRelDemo/kindle.json'

    clearTimeout(this.fetchData)

    return fetch(`${api}?limit=${limit}`)
      .then( res => res.json() )
      .then( json => {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(json),
        }, () => {
          // polling the api endpoint
          setTimeout(this.fetchData, this.state.time)
        });
      })
  }

  render() {
    return (
      <View style={{flex: 1, paddingTop: 20, flexDirection: 'column'}}>
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

        <View style={{flexDirection: 'row'}}>
          <View style={{backgroundColor: 'white'}}>
            <Text> {this.state.time}ms update intervals </Text>
            <Picker
              style={{borderColor: '#ccc', borderWidth: 1}}
              selectedValue={this.state.time}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({time: itemValue})
              }} >
              { timeInterval.map( t => (
                <Picker.Item label={ `${t} sec` } value={ t }  key={t}/> //`
                ) )
              }
            </Picker>
          </View>

          <View style={{backgroundColor: 'white' }}>
            <Text> Displaying {this.state.limit} posts </Text>
            <Picker
              style={{borderColor: '#ccc', borderWidth: 1}}
              selectedValue={this.state.limit}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({limit: itemValue}, this.fetchData)
              }} >
              { limits.map( t => (
                <Picker.Item label={ `show ${t}` } value={ t }  key={t}/> //`
                ) )
              }
            </Picker>
          </View>
          <View style={{backgroundColor: 'white' }}>
            <Text> Change account and Stream name</Text>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
            />
          </View>
        </View>

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
  }
});
