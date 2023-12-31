import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, SectionList, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const services = [
  {
    title: 'Hair',
    data: [
      { name: 'Hair Treatment', price: 'Rs. 1000', image: require('../src/Image16.png') },
    ],
  },
  {
    title: 'Makeup',
    data: [
      { name: 'Mehendi Makeup', price: 'Rs. 500', image: require('../src/Image4.png') },
      { name: 'Barat Makeup', price: 'Rs. 500', image: require('../src/Image18.png') },
      { name: 'Party Makeup', price: 'Rs. 500', image: require('../src/Image5.png') },
      { name: 'Engagement Makeup', price: 'Rs. 500', image: require('../src/Image3.png') },
      { name: 'Eye Makeup', price: 'Rs. 500', image: require('../src/Image2.png') },
    ],
  },
  {
    title: 'Mehendi',
    data: [
      { name: 'Mehendi', price: 'Rs. 550', image: require('../src/Image1.png') },
      { name: 'Barat Makeup', price: 'Rs. 500', image: require('../src/Image18.png') },
    ],
  },
  {
    title: 'Basic Work',
    data: [
      { name: 'Mehendi', price: 'Rs. 550', image: require('../src/Image1.png') },
      { name: 'Barat Makeup', price: 'Rs. 500', image: require('../src/Image18.png') },
    ],
  },
];

const ServicesPage = () => {
  const [filteredServices, setFilteredServices] = useState(services);
  const navigation = useNavigation();

  const renderServiceItem = ({ item }) => {
    const handleAddAppointment = () => {
      navigation.navigate('Appointment', { services: item.name });
    };

    return (
      <View style={styles.serviceContainer}>
        <Image source={item.image} style={styles.serviceImage} />
        <View style={styles.serviceTextContainer}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <Text style={styles.servicePrice}>{item.price}</Text>
          <Button title="Add" onPress={handleAddAppointment} />
        </View>
      </View>
    );
  };

  
  const renderSectionHeader = ({ section: { title } }) => {
    return <Text style={styles.sectionHeader}>{title}</Text>;
  };

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = services.filter((section) => {
      const filteredData = section.data.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerCaseQuery) ||
          item.price.toLowerCase().includes(lowerCaseQuery)
      );
      return filteredData.length > 0;
    });
    setFilteredServices(filtered);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        onChangeText={handleSearch}
      />
      <SectionList
        sections={filteredServices}
        keyExtractor={(item, index) => item + index}
        renderItem={renderServiceItem}
        renderSectionHeader={renderSectionHeader}
        style={styles.sectionList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  serviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceImage: {
    width: 150,
    height: 150,
    marginRight: 16,
  },
  serviceTextContainer: {
    flex: 1,
  },
  sectionList: {
    flexGrow: 1,
  },
  serviceName: {
    fontSize: 18,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#FF69B4',
    padding: 10,
    color: 'white',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
});

export default ServicesPage;
