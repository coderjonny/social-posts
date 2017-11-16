import React from 'react';
import { StyleSheet, Text,
  View, ListView, RefreshControl } from 'react-native';
import moment from 'moment';

export default class PostList extends React.Component {
  render() {
    return (
      <View style={styles.list}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.props.isLoading}
              onRefresh={this.props.pullFetch}
           />
          }
          dataSource={this.props.dataSource}
          renderRow={ (rowData) => (
            <View style={styles.body}>
              <Text>
                {rowData.text}
              </Text>
              <Text style={styles.messageUser}>
                { moment(new Date).format("MMM D 'YY [at] h:mma") }  - {rowData.user.name}
              </Text>
            </View>
          )}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingTop: 20
  },
  body: {
    padding: 20,
  },

  messageUser: {
    color: '#ccc'
  }
});

