import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
        marginBottom: 140,
        justifyContent: 'center',
        width: '70%',
        elevation: 1,


  },
});

export default function KivCardSignIn({ children }) {
  return (<View style={styles.container}>
    {children}
  </View>);
}