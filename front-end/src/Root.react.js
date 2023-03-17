import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import LoggedOutView from './loggedOut/LoggedOutView.react';
import MainView from './main/MainView.react';
import Header from './header/Header.react';


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f0f0',
    padding: 16,
    width: '100%',
    height: '100%',
  }
});

export default function Root({ navigation }) {
  const [username, setUsername] = useState(null);
  const [authToken, setAuthToken] = useState(null);


  const onLogUser = (username, authToken) => {
    setUsername(username);
    setAuthToken(authToken);
  }

  const logoutUser = () => {
    setUsername(null);
    setAuthToken(null);
  }

  return (
    <View style={{flex:1, flexDirection:'column'}}>
      <Header username={username} />
      <View style={styles.container}>
        {authToken != null
          ? <MainView authToken={authToken} logoutUser={logoutUser} navigation={navigation} username={username} />
          : <LoggedOutView onLogUser={onLogUser} />}

      </View>
    </View>
  );
}
// Rq: Dans React, ici username est un hook 
// pour modifier username depuis MainView, il faudrait également passer en argument setUser. 
// on ne le fait pas, donc dans l'app, username est fixé.