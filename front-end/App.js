import Root from './src/Root.react';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainView from './src/main/MainView.react';
import MapScreen from './src/main/MapScreen.react';
import Accident from './src/main/Accident.react';
import Liste_Accidents from './src/main/Liste_Accidents.react';
import CategorieAcc from './src/main/CategorieAcc';

const Stack = createStackNavigator();



function App() {
  return(
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Root" component={Root} options={{title: 'Welcome'}} />
      <Stack.Screen name="MainView" component={MainView} />
      <Stack.Screen name="Accident" component={Accident} options={{title: 'Déclaration de potentiels accidents'}}/>
      <Stack.Screen name="Liste_Accidents" component={Liste_Accidents} options={{title: 'Current accidents'}} />
      <Stack.Screen name="MapScreen" component={MapScreen} options = {{title:'Map'}}/>
      <Stack.Screen name="CategorieAcc" component={CategorieAcc} options={{title: 'Type of accidents'}}/>
    </Stack.Navigator>
  </NavigationContainer>
  );
}

export default App;
