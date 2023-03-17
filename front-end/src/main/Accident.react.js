import React, { useState } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker'
import { Picker } from '@react-native-picker/picker';
import { sendRequest } from '../common/sendRequest';



const styles = StyleSheet.create({
    Gcontainer: {
        backgroundColor: '#f8f0f0'
    },

    titleContainer: {
        paddingBottom: 20,
        paddingBottom: 20,
        alignItems: 'center',
        width: '100%',

    },
    titleA: {
        color: '#470303',
        fontSize: 32,
        marginBottom: 1,
        marginTop: '10%'
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
        marginBottom: '6%',
        paddingBottom:'2%',
        paddingTop:'2%',
        borderRadius: 40,
        justifyContent: 'center',
        paddingLeft: 10,
        display: 'flex',
        borderColor: '#470303',
        justifyContent: 'center',
        display: 'flex',
        padding: '2%',
        color: '#470303',
        marginLeft: 20,
        marginRight: 20,

    },
    container: {
        backgroundColor: '#f8f0f0',
        height: '100%',
        marginLeft: 25,
        marginRight: 25,
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    MyButton: {
        backgroundColor: '#ffffff',
        borderColor: '#4C034C',
        borderWidth: 1,
        marginLeft: '0%',
        marginRight:'0%',
        paddingBottom: '5%',
        paddingTop: '5%',
        paddingLeft: '19%',
        paddingRight: '19%',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',

    },
    box: {
        flexGrow: 4,
        padding: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        
        marginLeft: '10%'
    },

    MyText: {
        color: '#4C034C',
    }
});

export function formatDate(date){
    console.log(date)
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();
    var yyyy = date.getFullYear();
    var H = date.getHours();
    var M = date.getMinutes();
    var S = date.getSeconds();
    let datestring =  yyyy + '-' + ('0' + mm).slice(-2) + '-' + ('0' + dd).slice(-2) + ' ' + H + ':' + M + ':' + S; 
    console.log(`inside formatDate: ${datestring}`);
    return datestring;
};

export default function Accident({ navigation, route }) {

    let {typeAccident, username} = route.params; //same as typeAccident = route.params.typeAccident;
    const [street, setStreet] = useState('');
    const coords = route.params.coordinates;
    let latitude;
    let longitude;
    if( coords){
        console.log(`coords found ! ${coords}`)
        latitude = coords[0];
        longitude = coords[1];
    }
    console.log(`typeAccident is ${typeAccident}`); 
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date()); 

    const [incident, setIncident] = useState(String(typeAccident));
    const [open, setOpen] = useState(false);

    const [address, setAddress] = useState('')
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`)
      .then(response => response.json())
      .then(data => {
        setAddress(String(data.display_name));
      });

    function sendAccident() {

        sendRequest('/accident', 'POST', null,
            (status, data) => {
                if (status >= 200 && status < 300) {
                    navigation.navigate('MapScreen', { username: username });
                } else {
                }
            },

            () => { console.log("POST request failed"); },

            { username: username, coords: {latitude: coords[0], longitude:coords[1]}, description: description, address: address, date: formatDate(date), category: incident })

            ;
    }



    return (
        <View style={styles.Gcontainer}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleA}>Signalement d'un accident</Text>
                </View>
                <View style={styles.input}>
                    <Picker
                        style={styles.input}
                        selectedValue={incident}
                        onValueChange={(itemValue, itemIndex) =>
                            setIncident(itemValue)
                        }>
                        <Picker.Item label="Road Problems" value='1' />
                        <Picker.Item label="Construction Work" value='2' />
                        <Picker.Item label="Street Furniture Vandalism" value='3' />
                        <Picker.Item label="Bulky Items" value='4' />
                        <Picker.Item label="Wrongly Parked Car" value='5' />
                        <Picker.Item label="Waste Bins" value='6' />
                    </Picker>
                </View>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={(text) => {username = text;}}
                    placeholder="Nom de l'utilisateur"
                />
                <TextInput
                    style={styles.input}
                    value={coords ? `${coords[0].toFixed(2)},${coords[1].toFixed(2)}` : null}
                    onChangeText={(text) => setCoord(text)}
                    placeholder="Coordonnées de l'accident"
                />
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    placeholder="Description (facultatif)"
                    multiline={true}
                />
                <View style={styles.input}>
                    <TouchableOpacity onPress={() => setOpen(true)} >
                        <Text>Date : {date.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    <DatePicker
                        modal
                        mode="date"
                        style={[styles.picker, { alignSelf: 'center' }]}
                        open={open}
                        date={date}
                        onConfirm={(date) => {
                            setOpen(false)
                            setDate(date)
                        }}
                        onCancel={() => {
                            setOpen(false)
                        }}
                        onDateChange={setDate}
                    />
                    <DatePicker
                        modal
                        mode="datetime"
                        style={[styles.picker, { alignSelf: 'center' }]}
                        open={open}
                        date={date}
                        onConfirm={(date) => {
                            setOpen(false)
                            setDate(date)
                        }}
                        onCancel={() => {
                            setOpen(false)
                        }}
                        onDateChange={setDate}
                    />
                </View>
                <View style={styles.buttonRow}>
                    <View style={styles.box}>
                        <TouchableOpacity style={styles.MyButton} onPress={() => navigation.navigate('MapScreen', { username:username })}>
                            <Text style={styles.MyText}>Go to map</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.box}>
                        <TouchableOpacity style={styles.MyButton} onPress={() => {
                            sendAccident();
                            navigation.navigate('MapScreen', { username:username , reload_param : true});
                        }}>
                            <Text style={styles.MyText}>Enregistrer</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </View>
    );
}