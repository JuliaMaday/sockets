import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const DataListScreen = () => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Realiza solicitudes GET a tus endpoints de API para obtener la lista de datos
      const aguaResponse = await fetch('https://api-sensores-json.onrender.com/agua');
      const aguaData = await aguaResponse.json();

      const potenciometroResponse = await fetch('https://api-sensores-json.onrender.com/potenciometro');
      const potenciometroData = await potenciometroResponse.json();

      const ultrasonicoResponse = await fetch('https://api-sensores-json.onrender.com/ultrasonico');
      const ultrasonicoData = await ultrasonicoResponse.json();

      // Combina los datos obtenidos de los diferentes endpoints en una sola lista
      const combinedDataList = [
        { type: 'Nivel de Agua', value: aguaData.nivel },
        { type: 'Valor del Potenciómetro', value: potenciometroData.valor },
        { type: 'Distancia', value: ultrasonicoData.distancia },
      ];

      setDataList(combinedDataList);
    } catch (error) {
      console.error('Error al obtener la lista de datos:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.value}>{item.value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text>Guardar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Lista Datos</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={dataList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
  },
});

export default DataListScreen;
