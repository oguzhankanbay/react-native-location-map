import React, { useEffect, useState } from 'react';
import MapView, { Marker, Circle } from 'react-native-maps';
import { Button, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 60.1,
    longitude: -80.2,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [circleRadius, setCircleRadius] = useState(100);

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('izin reddedildi!');
    } else {
      let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      console.log(location.coords.latitude, location.coords.longitude);
    }
  };

  useEffect(() => {
    userLocation();

    const locationWatchId = Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        distanceInterval: 10,
      },
      (location) => {
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    );


    return () => {
      locationWatchId.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={mapRegion}>
        <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} title='marker' />
        <Circle
          center={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }}
          radius={circleRadius}
          fillColor="rgba(0, 0, 110, 0.3)"
        />
      </MapView>
      <Button title='Get Location' onPress={userLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
