import React, { useState, useEffect } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import DatePicker from 'react-native-date-picker'
import { Picker } from '@react-native-picker/picker';
import { sendRequest } from '../common/sendRequest';
import { acc } from 'react-native-reanimated';

const locations = [
  { lat: 48.84503173828125, lng: 2.3396084308624268, title: 'Mines ParisTech' },
];
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  box: {
    flexGrow: 2,
    padding: 0,
    justifyContent: 'center',
    width: '40%',
  },
  MyText: {
    color: '#4C034C',
    justifyContent: 'center'
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: '10%',
    marginRight: '10%'
  },
  MyButton: {
    backgroundColor: '#000000',
    borderColor: '#4C034C',
    borderWidth: 1,
    marginTop: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    width: '10%',
    height: '20%',
    borderRadius: 30,
  },

  Sendbox: {
    flexGrow: 2,
    padding: '15%',
    justifyContent: 'center',
    backgroundColor: 'red',
    width: '30%',
  },

  SendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  SendButton1: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    marginBottom: 0,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    display: 'flex',
    padding: '0.7%',
    color: '#470303',
    width: '100%',
    marginLeft: '9%',
  },
  SendButton2: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    marginBottom: 0,
    marginLeft: '1%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    display: 'flex',
    padding: '0.7%',
    color: '#470303',
    width: '100%',
    marginLeft: '10%',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#470303',
    marginBottom: '7%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '4%',
    display: 'flex',
    padding: 11,
    color: '#470303',
    width: '80%',
    marginLeft: '15%'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  inputcontainer: {
    backgroundColor: "rgba(85,136,194,1)",
    opacity: 0.75,
    marginLeft: '14%',
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 5,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 0.32,
    shadowRadius: 0,
    borderRadius: 59,
    borderWidth: 1.5,
    borderColor: "#000000",
    width: '70%',
    height: '35%',
    position: 'absolute',
    top: '8%',
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loremIpsum: {
    textAlign: 'center',
    fontFamily: "roboto-700",
    color: "#121212",
    opacity: 1,
    lineHeight: 100,
    letterSpacing: 0,
    fontSize: 25,
    paddingLeft:10,
    fontWeight: 'bold',
  },

  SendText: {
    color: 'white',
    justifyContent: 'center',
    fontWeight: 'bold',
  }
});



export default function MapScreen({ navigation, route }) {
  const { username } = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [reload, setReload ] = useState(false);


  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  const [accidents, setAccidents] = useState([]);

  useEffect(() => {sendRequest('/accident', 'GET', null,
    (status, data) => {
        if (status >= 200 && status < 300) {
            var listAcc = []
            for(let key in data){
              let categories = {1: "Road Problems", 2: "Construction Work", 3: "Street Furniture Vandalism" , 4: "Bulky Items", 5:"Wrongly Parked Car", 6: "Waste Bins"}
              let accident_obj = {};
              accident_obj['id'] = key
              let data_obj = data[key];
              accident_obj['title'] = categories[data_obj["category"]];
              accident_obj['auteur'] = username;
              accident_obj['date'] = data_obj['date'];
              accident_obj['address']  = data_obj['address'];
              accident_obj['latitude'] = data_obj['latitude'];
              accident_obj['longitude'] = data_obj['longitude']
              accident_obj['description'] = data_obj['desc'];
              listAcc.push(accident_obj);
            }
            console.log(listAcc)
            setAccidents(listAcc);
        }
        setReload(!reload);
    },
    () => { console.log("GET request failed"); })
  }, [route]);


  const [modalVisible, setModalVisible] = useState(false);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const markers = accidents.map((accident, index) => (
    <Marker
      key={index}
      coordinate={{
        latitude: accident.latitude,
        longitude: accident.longitude
      }}
      title={accident.title}
      description={accident.description}
    />
  ));

  const handleMapPress = (event) => {
    setReload(false);
    setModalVisible(true);
    setMarkerCoordinate(event.nativeEvent.coordinate);
    console.log(`pressed at location ${event.nativeEvent.coordinate.latitude},${event.nativeEvent.coordinate.longitude}`)

  };

  const [open, setOpen] = useState(false)
  const [incident, setIncident] = useState('Quel accident ?');
  const [date, setDate] = useState(new Date());

  const handleSavePress = () => {
    setModalVisible(false);
    setTitle('');
    setDescription('');
  };


  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        showsUserLocation={true}
        region={{
          latitude: userLocation ? userLocation.coords.latitude : 48.8234093,
          longitude: userLocation ? userLocation.coords.longitude : 2.2488825,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
      >

        {markers}

      </MapView>

      <Modal
        animationType="slide" transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.inputcontainer}>

          <Text style={styles.loremIpsum}> Accident report </Text>

          <View style={styles.buttonRow}>

            <View style={styles.box}>
              <TouchableOpacity style={styles.input} onPress={() => navigation.navigate('Accident', { typeAccident: 1, username: username, coordinates: [markerCoordinate.latitude, markerCoordinate.longitude] })}>
                <Text style={styles.MyText}>Road Problems</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.box}>
              <TouchableOpacity style={styles.input} onPress={() => navigation.navigate('Accident', { typeAccident: 2, username: username, coordinates: [markerCoordinate.latitude, markerCoordinate.longitude] })}>
                <Text style={styles.MyText}>Construction Work</Text>
              </TouchableOpacity>
            </View>

          </View>

          <View style={styles.buttonRow}>

            <View style={styles.box}>
              <TouchableOpacity style={styles.input} onPress={() => navigation.navigate('Accident', { typeAccident: 3, username: username, coordinates: [markerCoordinate.latitude, markerCoordinate.longitude] })}>
                <Text style={styles.MyText}>Street Furniture Vandalism</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.box}>
              <TouchableOpacity style={styles.input} onPress={() => navigation.navigate('Accident', { typeAccident: 4, username: username, coordinates: [markerCoordinate.latitude, markerCoordinate.longitude] })}>
                <Text style={styles.MyText}>Bulky Items</Text>
              </TouchableOpacity>
            </View>

          </View>

          <View style={styles.buttonRow}>

            <View style={styles.box}>
              <TouchableOpacity style={styles.input} onPress={() => navigation.navigate('Accident', { typeAccident: 5, username: username, coordinates: [markerCoordinate.latitude, markerCoordinate.longitude] })}>
                <Text style={styles.MyText}>Wrongly Parked Car</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.box}>
              <TouchableOpacity style={styles.input} onPress={() => navigation.navigate('Accident', { typeAccident: 6, username: username, coordinates: [markerCoordinate.latitude, markerCoordinate.longitude] })}>
                <Text style={styles.MyText}>Waste Bins</Text>
              </TouchableOpacity>
            </View>

          </View>

          <View style={styles.SendRow}>

            <View style={styles.Textbox}>
              <TouchableOpacity style={styles.SendButton1} onPress={() => navigation.navigate('Liste_Accidents')}>
                <Text style={styles.SendText}>List of accidents</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.SendButton2} onPress={handleSavePress}>
                <Text style={styles.SendText}>Back to map</Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>
      </Modal>

    </View>
  );
}



