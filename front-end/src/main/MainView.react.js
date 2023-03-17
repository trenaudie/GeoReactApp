import React, { useState } from 'react';
import { Button, View, StyleSheet, Text, PermissionsAndroid } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';



const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#f8f0f0',
    padding: '25%',
    width: '100%',
    paddingTop: '10%',
  },
  middleContainer: {
    flex: 1,
    backgroundColor: '#f8f0f0',
    padding: '2%',
    width: '100%',
    height: '70%',
    position: 'relative',
    justifyContent: 'center',
    paddingBottom: '0%',
    paddingLeft: '0%',
    marginLeft:'2%',
    marginRight:'2%'
  },
  cardContainer: {
    height: '30%',
    backgroundColor: '#f8f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    marginBottom: '10%',
    
  },
  title: {
    fontSize: 28,
    color: '#000000',
    fontWeight: 'bold',
    lineHeight: 30,
    marginTop:50,
    marginLeft:7,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  loremIpsum2: {
    textAlign: 'center',
    fontFamily: "roboto-700",
    color: "#121212",
    opacity: 0.75,
    lineHeight: 20,
    letterSpacing: 0,
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    backgroundColor: '#D8D6D8',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    borderRadius: 40,
    marginBottom: '20%',
    padding: '10%',
    width: '100%',
    marginRight: 50,
    flex: 1
  },

});

/**
 *
 * @param {string} authToken authToken for the authenticated queries
 * @param {()=>{}} logOutUser return to the logged out state
 * @returns
 */
export default function MainView({ authToken, username,logoutUser, navigation }) {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.cardContainer}>
        <Text style={styles.title}>Welcome on GeoProb, {username} ! </Text>
      </View>
      <View style={styles.middleContainer}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('MapScreen',{username:username})}>
            <Text style={styles.loremIpsum2}>Go to map  <View><Image style={{width: 15, height: 15}} source={require('../icons/map.png')}/></View>
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Liste_Accidents',{username:username})}>
            <Text style={styles.loremIpsum2}>List of accidents  <View><Image style={{width: 15, height: 15}} source={require('../icons/menu-burger.png')}/></View></Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={styles.buttonContainer} onPress={logoutUser}>
            <Text style={styles.loremIpsum2}>Log out   <View><Image style={{width: 15, height: 15}} source={require('../icons/exit.png')}/></View></Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </View>
  );
}