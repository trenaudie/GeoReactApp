import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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

export default function KivTextInput({ label, value, onChangeText, ...props }) {
  return (<View style={styles.inputContainer}>
    <Text
      style={styles.inputLabel}>
      {label}
    </Text>
    <TextInput 
      style={styles.input}
      onChangeText={onChangeText}
      value={value}
      {...props} />
  </View>);
}

