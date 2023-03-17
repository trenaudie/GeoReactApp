import React, { useState } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import DatePicker from 'react-native-date-picker'
import { Picker } from '@react-native-picker/picker';




const styles = StyleSheet.create({
    titleContainer: {
        paddingBottom: 20,
        paddingBottom: 20,
        alignItems: 'center',
        width: '100%'
    },
    titleA: {
        color: '#470303',
        fontSize: 32,
        marginBottom: 1,
        marginTop: 100
    },

    titleB: {
        color: '#470303',
        fontSize: 32,
        marginBottom: 1,
        marginTop: 1
    
    },


    input: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#470303',
        marginBottom: 7,
        borderRadius: 40,
        justifyContent: 'center',
        paddingLeft: 10,
        display: 'flex',
        padding: 8,
        color: '#470303',
        marginLeft: 20,
        marginRight: 20

    },
    container: {
        backgroundColor: '#f8f0f0',
        padding: 13,
        height: '100%',
        marginLeft: 25,
        marginRight: 25,
       
    },

    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 40,
    },
    MyButton: {
        backgroundColor: '#ffffff',
        borderColor: '#4C034C',
        borderWidth: 1,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        width: 80,
        height: 80,
        borderRadius: 30,
    

    },
    box: {
        flexGrow: 1,
        padding: 2,
    },

    MyText: {
        color: '#4C034C',
        justifyContent: 'center'
    }
});

export default function CategorieAcc ({ navigation, route }) {
    console.log(`username = ${route.params.username}`)
    username = route.params.username
    const [incident, setIncident] = useState('Quel accident ?');

    ////{1: Vandalism, 2: Const, 3 Pol, 4 Car crash, 5 Blocked, 6 Traff}

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleA}>Choisissez le type</Text>
                <Text style={styles.titleB}>d'accident</Text>
            </View>
            
            <View style={styles.buttonRow}>
                <View style={styles.box}>
                <TouchableOpacity style={styles.MyButton} onPress={() => navigation.navigate('Accident', {typeAccident: '1', username:username})}>
                    <Text style={styles.MyText}>Vandalism</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.box}>
                <TouchableOpacity style={styles.MyButton} onPress={() => navigation.navigate('Accident', {typeAccident: '2',username:username})}>
                    <Text style={styles.MyText}>Construction work</Text>
                </TouchableOpacity>
                </View>
            </View>
            <View style={styles.buttonRow}>
                <View style={styles.box}>
                <TouchableOpacity style={styles.MyButton} onPress={() => navigation.navigate('Accident', {typeAccident: '3',username:username})}>
                    <Text style={styles.MyText}>Police</Text>
                    <View><Image style={{width: '1%', height: '1%'}} source={require('../icons/map.png')}/></View>
                </TouchableOpacity>
                </View>
                <View style={styles.box}>
                <TouchableOpacity style={styles.MyButton} onPress={() => navigation.navigate('Accident', {typeAccident: '4',username:username})}>
                    <Text style={styles.MyText}>Car crash</Text>
                </TouchableOpacity>
                </View>
            </View>
            <View style={styles.buttonRow}>
                <View style={styles.box}>
                <TouchableOpacity style={styles.MyButton} onPress={() => navigation.navigate('Accident', {typeAccident: '5',username:username})}>
                    <Text style={styles.MyText}>Blocked street</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.box}>
                <TouchableOpacity style={styles.MyButton} onPress={() => navigation.navigate('Accident', {typeAccident: '6',username:username})}>
                    <Text style={styles.MyText}>Traffic</Text>
                </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}