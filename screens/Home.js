import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { io } from 'socket.io-client';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';

const socket = io('http://192.168.1.68:3000');

export default function HomeScreen() {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);
  const [waterLevel, setWaterLevel] = useState('Desconocido');
  const [potValue, setPotValue] = useState('Desconocido');
  const [distance, setDistance] = useState('Desconocido');

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('water_level', (level) => setWaterLevel(level));
    socket.on('pot_value', (value) => setPotValue(value));
    socket.on('distance', (distance) => setDistance(distance));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('water_level');
      socket.off('pot_value');
      socket.off('distance');
    };
  }, []);

  const handleSave = async () => {
    console.log('Guardando datos...');

    try {
      // Enviar datos de nivel de agua
      await fetch('https://api-sensores-json.onrender.com/agua', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nivel: waterLevel }), // Enviar el nivel de agua con el nombre de campo "nivel"
      });

      // Enviar datos del potenciómetro
      await fetch('https://api-sensores-json.onrender.com/potenciometro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ valor: potValue }), // Enviar el valor del potenciómetro con el nombre de campo "valor"
      });

      // Enviar datos de distancia
      await fetch('https://api-sensores-json.onrender.com/ultrasonico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ distancia: distance }), // Enviar la distancia con el nombre de campo "distancia"
      });

      console.log('Datos guardados correctamente');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
    }
  };

  const handleViewData = () => {
    console.log('Viendo la lista de datos guardados...');
    navigation.navigate('Data');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.viewDataButton} onPress={handleViewData}>
          <Text style={styles.viewDataButtonText}>Lista Datos</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.sensorData}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://sandorobotics.com.mx/wp-content/uploads/2023/09/senwea00518_01.jpg' }} 
            style={styles.image} 
          />
        </View>
        <View style={styles.dataItem}>
          <MaterialCommunityIcons name="cup-water" size={24} color="blue" />
          <Text style={styles.dataValue}>{waterLevel}</Text>
          <Text>Nivel de agua</Text>
        </View>
        <Image 
            source={{ uri: 'https://m.media-amazon.com/images/I/41-X9V-5mHL.jpg' }} 
            style={styles.image} 
          />
        <View style={styles.dataItem}>
          <MaterialCommunityIcons name="amplifier" size={24} color="orange" />
          <Text style={styles.dataValue}>{potValue}</Text>
          <Text>potenciómetro</Text>
        </View>
        <Image 
            source={{ uri: 'https://electronicamade.com/wp-content/uploads/2020/03/sensor-distancia-ultrasonido-1.jpg' }} 
            style={styles.image} 
          />
        <View style={styles.dataItem}>
          <MaterialCommunityIcons name="ruler" size={24} color="purple" />
          <Text style={styles.dataValue}>{distance}</Text>
          <Text>Distancia</Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4D392',
    alignItems: 'center', 
    paddingTop: 50, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%', 
    paddingHorizontal: 25, 
  },
  connectionStatus: {
    fontSize: 18,
  },
  connected: {
    color: 'green',
  },
  disconnected: {
    color: 'red',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sensorData: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dataValue: {
    marginLeft: 20,
    marginRight: 10,
    textAlign: 'center', 
  },
  dataLabel: {
    textAlign: 'center', 
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  viewDataButton: {
    backgroundColor: '#89373d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  viewDataButtonText: {
    color: '#89373d',
    fontWeight: 'bold',
  },
});
