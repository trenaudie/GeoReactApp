import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginBottom: 90,
    backgroundColor : '#f8f0f0'
  },
});

export default function KivCardSignUp({ children }) {
  return (<View style={styles.container}>
    {children}
  </View>);
}