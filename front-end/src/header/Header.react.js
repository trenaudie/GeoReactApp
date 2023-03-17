import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    headerLoggedOut: {
        backgroundColor: '#f8f0f0',
        padding: 8
    },

    headerSignIn: {
        backgroundColor: '#8cff91',
        padding: 8
    }


});

export default function Header({ username }) {
    const text = username == null ? ''
        : <Text style={styles.headerSignIn}>Logged in as {username}</Text>;
    return (<View style={styles.headerLoggedOut}>{text}</View>);
}