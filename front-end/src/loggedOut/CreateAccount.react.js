import React, { useState } from 'react';
import { TextInput, Button, View, Text, StyleSheet } from 'react-native';
import KivTextInput from '../common/KivTextInput.react';
import KivCardSignUp from '../common/KivCard.react';
import { TouchableOpacity } from 'react-native';

import { sendRequest } from '../common/sendRequest';

import { NativeModules } from 'react-native';

const { Log } = NativeModules;

const styles = StyleSheet.create({
  titleContainer: {
     
    paddingBottom: 16,
    alignItems: 'center',
    width: '100%'
  },
  title: {
    fontSize: 36,
    color: '#000000',
    fontWeight: 'bold',
    lineHeight: 50,
    paddingLeft:'30%',
    paddingRight:'30%',
    paddingBottom:'10%'
  },
  incorrectWarning: {
    backgroundColor: '#FF8A80',
    padding: 4,
    borderRadius: 40,
    marginBottom: 20,
    textAlign: 'center',
    justifyContent: 'center',
    display: 'flex',
    padding: 5,
    paddingLeft: 10,
  },
  buttonRow: {
    flexDirection: 'row'
  },
  box: {
    flexGrow: 1,
    padding: 2,
    paddingTop:'7%'
  },
  MyButton: {
    backgroundColor: '#F8F0F0',
    borderColor: '#470303',
    borderWidth: 1,
    paddingTop: 7,
    paddingLeft: 10,
    paddingBottom: 7,
    paddingRight: 10,
    borderRadius: 40, 
  },
  MyText:  {
    textAlign: 'center',
    fontFamily: "roboto-700",
    color: "#121212",
    opacity: 0.75,
    lineHeight: 20,
    letterSpacing: 0,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer1: {
    backgroundColor: '#D8D6D8',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    borderRadius: 40,
    marginBottom: '0%',
    padding: '10%',
    width: '100%',
    marginRight: 70,
    flex: 1
  },
  buttonContainer2: {
    backgroundColor: '#D8D6D8',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    borderRadius: 40,
    marginBottom: '0%',
    padding: '10%',
    width: '100%',
    marginRight: 25,
    flex: 1
  },
  input: {
      backgroundColor: '#dbc8c8',
      borderRadius: 40,
      color: '#470303',
      justifyContent: 'center',
      padding: 5,
      paddingLeft: 10,
      display: 'flex',
      paddingBottom:'1.5%',
      paddingTop:'1.5%',
    },
    inputLabel: {
      fontSize: 13,
      alignSelf: 'center',
      justifyContent: 'center',
      color: '#370303',
      fontWeight: '500',
    },
});
function KivTextInput2({ label, value, onChangeText, ...props }) {
  const maskedValue = value.replace(/./g, '*');

  return (<View style={styles.inputContainer}>
    <Text
      style={styles.inputLabel}>
      {label}
    </Text>
    <TextInput
      style={styles.input}
      onChangeText={onChangeText}
      value={maskedValue}
      {...props} />
  </View>);
}
export default function CreateAccount({ onSuccess, onCancel }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasFailure, setHasFailure] = useState(false);

  const sendUserCreationRequest = () => {
    setIsLoading(true);
    //(route, method, credentials, callback, failureCallback, parameters)

    sendRequest('/register', 'POST', { login: username.trim(), password: password.trim() }, (status, data) => {

      setIsLoading(false);
      if (status >= 200 && status < 300) {
        setHasFailure(false);
        onSuccess();
      } else {
        setHasFailure(true);
      }
    }, () => {console.log("POST request failed"); setIsLoading(false); setHasFailure(true)}, 
    { name: name, surname: surname});
  }

  return (
    <KivCardSignUp >
      <View
        style={styles.titleContainer}>
        <Text
          style={styles.title}>
          Create Account
        </Text>
      </View>
      {hasFailure && <View style={styles.incorrectWarning}>
        <Text
          style={styles.inputLabel}>
          Something went wrong while creating the user
        </Text>
      </View>}
      <KivTextInput placeholder="Calvin" label="Enter your username" value={username} onChangeText={value => setUsername(value)} />
      <KivTextInput2 placeholder="Hobbes" label="Password" value={password} onChangeText={value => setPassword(value)} />
      <View style={styles.buttonRow}>
        <View style={styles.box}>
          <TouchableOpacity style={styles.buttonContainer2} onPress={() => { sendUserCreationRequest(); }}>
            <Text style={styles.MyText}>  Create Account</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.box}>
          <TouchableOpacity style={styles.buttonContainer1} onPress={() => { onCancel(); }}>
            <Text style={styles.MyText}>   Sign in </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KivCardSignUp>

  
  );
}