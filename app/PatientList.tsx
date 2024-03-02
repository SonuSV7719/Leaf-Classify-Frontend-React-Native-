import { View, Text, TextInput, StyleSheet, FlatList, Image, Modal, ActivityIndicator, Alert, Button, Pressable } from 'react-native'
import React, { useEffect, useState, PureComponent } from 'react'
import { collection, getDocs, query, orderBy, limit, deleteDoc, doc, updateDoc, where } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../components/firebaseConfig';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ref, deleteObject } from 'firebase/storage';
import { EvilIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { startOfDay, endOfDay } from 'date-fns';
const PatientList = () => {

  const db = FIREBASE_DB;
  const storage = FIREBASE_STORAGE;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [id, setId] = useState("")
  // const [searchClicked, setSearchClicked] = useState(false)
  // const [searchQuery, setSearchQuery] = useState('');
  // const [searchResults, setSearchResults] = useState([]);

  const router = useRouter();

  const today = new Date(); 
  const startOfToday = startOfDay(today); 
  const endOfToday = endOfDay(today);

  class Card extends PureComponent {
    render() {
      const { item } = this.props;
      return (
        <View style={styles.card}>
          {item.imageUrl && (
            <Image style={styles.image} source={{ uri: item.imageUrl }} />
          )}
          <View style={styles.cardContent}>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text>{item.name || 'N/A'}</Text>
            </View>
            {/* <View style={styles.row}>
              <Text style={styles.label}>Age:</Text>
              <Text>{item.age || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Resident of:</Text>
              <Text>{item.residentOf || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Blood Group:</Text>
              <Text>{item.bloodGroup || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Dental Caries:</Text>
              <Text>{item.dentalCaries || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Periodontal Disease:</Text>
              <Text>{item.periodontalDisease || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Diabetes:</Text>
              <Text>{item.diabetes || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Heart Disease:</Text>
              <Text>{item.heartDisease || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Respiratory Disease:</Text>
              <Text>{item.respiratoryDisease || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Mental Health Issue:</Text>
              <Text>{item.mentalHealthIssue || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Cerebrovascular Disease:</Text>
              <Text>{item.cerebrovascularDisease || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Joint Disease:</Text>
              <Text>{item.jointDisease || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Sensory Impairment:</Text>
              <Text>{item.sensoryImpairment || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>COVID:</Text>
              <Text>{item.covid || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Blood Pressure:</Text>
              <Text>{item.bloodPressure || 'N/A'}</Text>
            </View> */}
            <View style={styles.row}>
              <Text style={styles.label}>Any Other Findings:</Text>
              <Text>{item.anyOtherFindings || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Predicted Class:</Text>
              <Text>{item.predictedClass || 'N/A'}</Text>
            </View>
            {
              item.id == id && deleteLoading && <View>
                <Text style={{ alignSelf: 'center' }}>Deleting data...</Text>
                <ActivityIndicator size="large" color="#008AE9" />
              </View>
            }

            {/* Delete button & Edit Icon  */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            </View>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id, item.imageUrl)}>
                <Text style={{ fontWeight: 'bold', color: "#fff" }}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item.id)}>
                <FontAwesome name="edit" size={20} color="white" />
                <Text style={{ fontWeight: 'bold', marginLeft: 5, color: "#fff" }}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  };

  const handleDelete = (id, imageUrl) => {
    setDeleteLoading(true)
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteData(id, imageUrl);
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
    setDeleteLoading(false)
  };


  const handleEdit = (itemID) => {
    router.push(`/EditData`);
    router.setParams({ itemID: itemID })
  };
  const getLatestData = async (collectionName) => {
    setLoading(true);
    try {

      const q = query(
        collection(db, collectionName),
        where('createdAt', '>=', startOfToday),
        where('createdAt', '<=', endOfToday),
        orderBy('createdAt', 'desc'),
      );
      const querySnapshot = await getDocs(q);
      const retrivedData = [];
      querySnapshot.forEach((doc) => {
        retrivedData.push({ id: doc.id, ...doc.data() })
      })
      setData(retrivedData)
    } catch (error) {
      Alert.alert('Error getting documents: ' + error);
    } finally {
      // console.log(data)
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLatestData = async (collectionName) => {
      setLoading(true);
      try {

        const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'), limit(10))
        const querySnapshot = await getDocs(q);
        const retrivedData = [];
        querySnapshot.forEach((doc) => {
          retrivedData.push({ id: doc.id, ...doc.data() })
        })
        setData(retrivedData)
      } catch (error) {
        Alert.alert('Error getting documents: ' + error);
      } finally {
        // console.log(data)
        setLoading(false);
      }
    };

    const collectionName = 'patient';
    getLatestData(collectionName);
  }, [db]);

  const deleteData = async (itemID, imageUrl) => {
    setDeleteLoading(true)
    // console.log(itemID);
    const collectionRef = collection(db, 'patient');
    const docRef = doc(collectionRef, itemID);
    // console.log(docRef);
    const parts = imageUrl.split('/');
    const lastPart = parts[parts.length - 1];

    const decodedValue = decodeURIComponent(lastPart);
    const imagePath = decodedValue.split("?")[0]
    if (imageUrl) {
      const desertRef = ref(storage, imagePath);
      deleteObject(desertRef).then(() => {
        // console.log("object: ", desertRef)
        Alert.alert("Deleted data")
      }).catch((error: any) => {
        // console.log("erro", error)
        Alert.alert("Error" + error)
      });
    }

    // console.log(imagePath);
    try {

      setId(itemID)
      const updatedDocFile = await updateDoc(docRef, {})
      // console.log("updatedDoc", updatedDocFile)
      const deletedRes = await deleteDoc(docRef);
      // console.log('Document successfully deleted:', deletedRes);
    } catch (error: any) {
      // console.error('Error deleting document:', error);
      Alert.alert(error)
    } finally {
      setDeleteLoading(false)
      getLatestData('patient')
    }
  };

  const handleSearch = () => {
    console.log('hi')
  }


  return (
    <View style={{ marginBottom: 70 }}>
      {/* <View style={styles.searchContainer}>
        <TextInput placeholder='Search...' style={styles.searchbar} />
        <Pressable style={styles.searchIconClick} onPress={handleSearch} >
          <EvilIcons name="search" size={24} color="black" style={styles.searchIcon} />
        </Pressable>
      </View> */}
      {loading ? (
        <View>
          <Text style={{ marginHorizontal: 10, marginVertical: 10, alignSelf: 'center' }}>Loading data...</Text>
          <ActivityIndicator size="large" color="#008AE9" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Card item={item}
          />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 10
  },
  cardContent: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    width: 200
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: 100,
    marginRight: 20
  },
  editButton: {
    backgroundColor: '#65B741',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: 100,
  },
  searchContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: 'row',
    marginBottom: 5
  },
  searchbar: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#fff'
  },
  searchIconClick: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    width: 50,
    height: 'auto',
  },
  searchIcon: {
    right: 50,
    top: 3,
  }
});

export default PatientList