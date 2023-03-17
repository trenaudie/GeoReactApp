import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { formatDate } from './Accident.react.js';
import { sendRequest } from '../common/sendRequest';
import Geolocation from 'react-native-geolocation-service';

const styles = StyleSheet.create({
  accidentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#470303', // trait 
    backgroundColor: '#f8f0f0', // fond en #E3F2FD
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#470303', // titre  
  },
  date: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
  },
  buttonContainer: {
    backgroundColor: '#D8D6D8',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    borderRadius: 40,
    marginBottom: '0%',
    padding: '0%',
    width: '100%',
    marginRight: '40%',
    marginLeft:'40%',
    marginTop:2,
    marginBottom:2,
    flex: 1
  },
  loremIpsum2: {
    textAlign: 'center',
    fontFamily: "roboto-700",
    color: "#121212",
    opacity: 0.75,
    lineHeight: 20,
    letterSpacing: 0,
    fontSize: 15,
    fontWeight: 'bold',
  },
  button: {
    color: "#212121",
    backgroundColor: "#D8D8D8",
    width: '100%',
    height: '100%',
  },
});

const Item = ({ name, onPress }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={styles.loremIpsum2}>{name}</Text>
    <TouchableOpacity style={styles.buttonContainer} title="Delete" onPress={onPress}>
      <Text style={styles.loremIpsum2}>Delete</Text>
    </TouchableOpacity>
  </View>
);

const EARTH_RADIUS = 6371;

const rad = (x) => x * Math.PI / 180;

const getDistance = (lat1, lng1, lat2, lng2) => {
  let dLat = rad(lat2 - lat1);
  let dLng = rad(lng2 - lng1);
  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = EARTH_RADIUS * c;
  return d;
};




export default function Liste_Accidents({ route, navigation }) {
  let username = route.params.username;
  const [accidents, SetAccidents] = useState(null)
  const [userLatitude, setUserLatitude] = useState(48.8453543);
  const [userLongitude, setUserLongitude] = useState(2.3390458);
  const [reload, setReload] = useState(0);

  useEffect(() => {

    Geolocation.getCurrentPosition(
          (position) => {
            setUserLatitude(position.coords.latitude);
            setUserLongitude(position.coords.longitude);
          },
          (error) => console.log(error),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );

    sendRequest('/accident', 'GET', null,
      (status, data) => {
        if (status >= 200 && status < 300) {
          //SetAccidents (id, title, auteur, adresse, date, description)
          let listAcc = []
          for (let key in data) {
            let categories = { 1: "Road Problems", 2: "Construction Work", 3: "Street Furniture Vandalism", 4: "Bulky Items", 5: "Wrongly Parked Car", 6: "Waste Bins" }
            let accident_obj = {};
            accident_obj['id'] = key
            let data_obj = data[key];
            accident_obj['title'] = categories[data_obj["category"]];
            accident_obj['auteur'] = username
            accident_obj['date'] = data_obj['date']
            accident_obj['address'] = data_obj['address']
            accident_obj['latitude'] = data_obj['latitude']
            accident_obj['longitude'] = data_obj['longitude']
            accident_obj['description'] = data_obj['desc']
            accident_obj['distance'] = getDistance(data_obj['latitude'], data_obj['longitude'], userLatitude, userLongitude)
            listAcc.push(accident_obj);
          }
          SetAccidents(listAcc)
        } else {
        }
      },

      () => { console.log("GET request failed"); },
      { date: formatDate(new Date()) })

    }, [navigation, reload]);

    if (accidents) { 
        accidents.sort((a,b) => {
        if (a.distance > b.distance) return 1;
        if (a.distance < b.distance) return -1;
        return 0;
        })
    }
    const handleDelete = key => {
            sendRequest('/accident', 'DELETE', null,
                (status, data) => {
                        console.log('Successfully deleted')
                        setTimeout(()=>{setReload(reload+1)}, 500)
                    }
                ,
                () => { console.log("GET request failed"); }, {id: key})
          };


  const renderAccident = ({ item }) => (
    <TouchableOpacity style={styles.accidentContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style= {styles.description}>{item.description}</Text>
      <Text style= {styles.description}>At {item.distance.toFixed(2)} km from your current location </Text>
      <Text style= {styles.description}>{item.address}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <Item name={item.name} onPress={() => handleDelete(item.id)} />
    </TouchableOpacity>
  );


    return (
        <View>
            <FlatList
                data={accidents}
                renderItem={renderAccident}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    )
};