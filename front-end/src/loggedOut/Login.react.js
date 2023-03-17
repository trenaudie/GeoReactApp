import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { sendRequest } from '../common/sendRequest';
import KivTextInput from '../common/KivTextInput.react';
import KivCardSignIp from '../common/KivCardSignIn.react';
import KivCardSignIn from '../common/KivCardSignIn.react';


const styles = StyleSheet.create({
  titleContainer: {
    paddingBottom: 28,
    alignItems: 'center',
    width: '100%',
    marginBottom:'15%',
  },
  title: {
    fontSize: 36,
    color: '#000000',
    fontWeight: 'bold',
    lineHeight: 50,
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
    flexDirection: 'row', 
    marginTop:'10%',
  },
  box: {
    flexGrow: 1,
    padding: 2,
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
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
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
  inputContainer: {
    marginBottom: 24,
    marginTop:10,
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
/**
 * Login component with User & Password
 * @param {(username:string, authToken:string) => {}} onSuccess
 * @param {() => {}} onCancel
 */
export default function Login({ onSuccess, onCancel }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user_id, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInvalidLogin, setHasInvalidLogin] = useState(false);

  const sendLoginRequest = () => {
    setIsLoading(true);
    sendRequest('/login', 'GET', { login: username.trim(), password: password.trim() }, (status, data) => {
      setIsLoading(false);
      console.log('status: ')
      console.log(status)
      console.log('data: ')
      setUserId(data.id); //setting the user id, obtained from the table geoprob.User2
      if (status == 201) {
        setHasInvalidLogin(false);
        onSuccess(username, data);
      } else {
        setHasInvalidLogin(true);
      }
    }, () => {
      setIsLoading(false); setHasInvalidLogin(true)});
  }

  return (
    <KivCardSignIn>
      <View
        style={styles.titleContainer}>
        <Text 
          style={styles.title}>
          Sign in
        </Text>
      </View>
      {hasInvalidLogin && <View style={styles.incorrectWarning}>
        <Text
          style={styles.inputLabel}>
          The username or password is incorrect
        </Text>
      </View>}
      <KivTextInput placeholder="pseudo" label="Username" value={username} onChangeText={value => setUsername(value)} />
      <KivTextInput2 placeholder="password" label="Password" value={password} onChangeText={value => setPassword(value)} />
      <View style={styles.buttonRow}>
        <View style={styles.box}>
          <TouchableOpacity style={styles.buttonContainer1} onPress={() => { sendLoginRequest(); }}>
            <Text style={styles.MyText}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.box}>
          <TouchableOpacity style={styles.buttonContainer2} 
          onPress={() => { onCancel(); }}>
            <Text style={styles.MyText}>Create account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KivCardSignIn>
  );
}