import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, getDoc } from 'firebase/firestore';
import { collection, addDoc, serverTimestamp, getDocs, query, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../components/firebaseConfig';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FIREBASE_STORAGE } from '../components/firebaseConfig';

const FormData = global.FormData;

const EditData = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [residentOf, setResidentOf] = useState('');
    const [bloodGroup, setBloodGroup] = useState("A+");
    const [dentalCaries, setDentalCaries] = useState('No');
    const [periodontalDisease, setPeriodontalDisease] = useState('No');
    const [diabetes, setDiabetes] = useState('No');
    const [heartDisease, setHeartDisease] = useState('No');
    const [respiratoryDisease, setRespiratoryDisease] = useState("No");
    const [mentalHealthIssue, setMentalHealthIssue] = useState('No');
    const [cerebrovascularDisease, setCerebrovascularDisease] = useState('No');
    const [jointDisease, setJointDisease] = useState('No');
    const [sensoryImpairment, setSensoryImpairment] = useState('No');
    const [covid, setCovid] = useState('No');
    const [bloodPressure, setBloodPressure] = useState('No');
    const [anyOtherFindings, setAnyOtherFindings] = useState('');

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState('');
    const [predictionOutput, setPredictionOutput] = useState("");
    const [plantName, setPlantName] = useState('Potato');

    const db = FIREBASE_DB;
    const router = useRouter();
    const storage = FIREBASE_STORAGE;
    const { itemID } = useLocalSearchParams();
    const navigation = useNavigation();

    useEffect(() => {
        const getSpecificData = async (collectionName, itemID) => {
            setLoading(true);
            try {
                const docRef = doc(db, collectionName, itemID);
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    //   setData({ id: docSnapshot.id, ...docSnapshot.data() });
                    // console.log(docSnapshot.data())
                    setName(docSnapshot.data().name)
                    setAge(docSnapshot.data().age)
                    setResidentOf(docSnapshot.data().residentOf)
                    setBloodPressure(docSnapshot.data().bloodPressure)
                    setBloodGroup(docSnapshot.data().bloodGroup)
                    setDentalCaries(docSnapshot.data().dentalCaries)
                    setPeriodontalDisease(docSnapshot.data().periodontalDisease)
                    setDiabetes(docSnapshot.data().diabetes)
                    setHeartDisease(docSnapshot.data().heartDisease)
                    setMentalHealthIssue(docSnapshot.data().mentalHealthIssue)
                    setRespiratoryDisease(docSnapshot.data().respiratoryDisease)
                    setCerebrovascularDisease(docSnapshot.data().cerebrovascularDisease)
                    setJointDisease(docSnapshot.data().jointDisease)
                    setSensoryImpairment(docSnapshot.data().sensoryImpairment)
                    setCovid(docSnapshot.data().covid)
                    setPredictionOutput(docSnapshot.data().predictedClass)
                    setAnyOtherFindings(docSnapshot.data().anyOtherFindings)
                    setPlantName(docSnapshot.data().name)
                    if (docSnapshot.data().imageUrl != "") {
                        setImageUrl(docSnapshot.data().imageUrl)
                    }
                } else {
                    Alert.alert("Data not found on database")
                }
            } catch (error) {
                Alert.alert('Error getting document: ' + error);
            } finally {
                setLoading(false);
            }
        };
        // console.log(itemID)
        const collectionName = 'patient';
        getSpecificData(collectionName, itemID);
    }, [db]);


    const handleSubmit = async () => {
        const data = {
            name: name,
            age: age,
            residentOf: residentOf,
            bloodGroup: bloodGroup,
            dentalCaries: dentalCaries,
            periodontalDisease: periodontalDisease,
            diabetes: diabetes,
            heartDisease: heartDisease,
            respiratoryDisease: respiratoryDisease,
            mentalHealthIssue: mentalHealthIssue,
            cerebrovascularDisease: cerebrovascularDisease,
            jointDisease: jointDisease,
            sensoryImpairment: sensoryImpairment,
            covid: covid,
            bloodPressure: bloodPressure,
            anyOtherFindings: anyOtherFindings,
            predictedClass: predictionOutput,
            createdAt: serverTimestamp()
        }

        const collectionRef = collection(db, 'patient');
        const docRef = doc(collectionRef, itemID);
        setLoading(true);
        try {
            const updatedDocFile = await updateDoc(docRef, data)
            Alert.alert("Data updated!")
        } catch (error) {
            Alert.alert(error)
        } finally {
            // getLatestData('patient')
            navigation.pop();
            router.replace('./PatientList')
        }
        setLoading(false)
    };


    return (
        <ScrollView>
            {
                loading ? (
                    <View>
                        <Text style={{ marginHorizontal: 10, marginVertical: 10, alignSelf: 'center' }}>Loading data...</Text>
                        <ActivityIndicator size="large" color="#008AE9" />
                    </View>
                ) : (
                    <ScrollView style={styles.container}>
                        <View style={styles.formGroup}>
                            {/* name of patient  */}
                            <Text style={styles.label}>Name of Plant</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={plantName}
                                onValueChange={(value) => setPlantName(value)}
                            >
                                <Picker.Item label="Potato" value="Potato" />
                                <Picker.Item label="Tomato" value="Tomato" />
                            </Picker>

                            {/* Age */}
                            {/* <Text style={styles.label}>Age</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter age..."
                                value={age}
                                onChangeText={(text) => setAge(text)}
                                keyboardType="numeric"
                            /> */}
                            {/* Resident of */}
                            {/* <Text style={styles.label}>Resident of</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Resident of..."
                                value={residentOf}
                                onChangeText={(text) => setResidentOf(text)}
                            /> */}

                            {/* Blood pressure */}
                            {/* <Text style={styles.label}>Blood Pressure</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={bloodPressure}
                                onValueChange={(value) => setBloodPressure(value)}
                            >
                                <Picker.Item label="No" value="No" />
                                <Picker.Item label="Yes" value="Yes" />
                            </Picker> */}

                            {/* Blood Group */}
                            {/* <Text style={styles.label}>Blood Group</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={bloodGroup}
                                onValueChange={(value) => setBloodGroup(value)}
                            >
                                <Picker.Item label="A+" value="A+" />
                                <Picker.Item label="A-" value="A-" />
                                <Picker.Item label="B+" value="B+" />
                                <Picker.Item label="B-" value="B-" />
                                <Picker.Item label="AB+" value="AB+" />
                                <Picker.Item label="AB-" value="AB-" />
                                <Picker.Item label="O+" value="O+" />
                                <Picker.Item label="O-" value="O-" />
                                <Picker.Item label="None" value="None" />
                            </Picker> */}

                            {/* Dental Caries */}
                            {/* <Text style={styles.label}>Dental Caries</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={dentalCaries}
                                onValueChange={(value) => setDentalCaries(value)}
                            >
                                <Picker.Item label="No" value="No" />
                                <Picker.Item label="Yes" value="Yes" />
                            </Picker> */}

                            {/* Periodontal Disease */}
                            {/* <Text style={styles.label}>Periodontal Disease</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={periodontalDisease}
                                onValueChange={(value) => setPeriodontalDisease(value)}
                            >
                                <Picker.Item label="No" value="No" />
                                <Picker.Item label="Yes" value="Yes" />
                            </Picker> */}

                            {/* Diabetes */}
                            {/* <Text style={styles.label}>Diabetes</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={diabetes}
                                onValueChange={(value) => setDiabetes(value)}
                            >
                                <Picker.Item label="No" value="No" />
                                <Picker.Item label="Yes" value="Yes" />
                            </Picker> */}

                            {/* Heart Disease */}
                            {/* <Text style={styles.label}>Heart Disease</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={heartDisease}
                                onValueChange={(value) => setHeartDisease(value)}
                            >
                                <Picker.Item label="No" value="No" />
                                <Picker.Item label="Yes" value="Yes" />
                            </Picker> */}

                            {/* Respiratory Disease */}
                            {/* <Text style={styles.label}>Respiratory Disease</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={respiratoryDisease}
                                onValueChange={(value) => setRespiratoryDisease(value)}
                            >
                                <Picker.Item label="No" value="No" />
                                <Picker.Item label="Yes" value="Yes" />
                            </Picker> */}

                            {/* Mental Health issue */}
                            {/* <Text style={styles.label}>Mental Health issue</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={mentalHealthIssue}
                                onValueChange={(value) => setMentalHealthIssue(value)}
                            >
                                <Picker.Item label="No" value="No" />
                                <Picker.Item label="Yes" value="Yes" />
                            </Picker>
 */}

                            {/* Cerebrovascular Disease */}
                            {/* <Text style={styles.label}>Cerebrovascular Disease</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={cerebrovascularDisease}
                                onValueChange={(value) => setCerebrovascularDisease(value)}
                            >
                                <Picker.Item label="No" value="No" />
                                <Picker.Item label="Yes" value="Yes" />
                            </Picker> */}

                            {/* Joint Disease */}
                            {/* <Text style={styles.label}>Joint Disease</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={jointDisease}
                                onValueChange={(value) => setJointDisease(value)}
                            >
                                <Picker.Item label="No" value="No" />
                                <Picker.Item label="Yes" value="Yes" />
                            </Picker> */}


                            {/* Sensory Impairment */}
                            {/* <Text style={styles.label}>Sensory Impairment</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={sensoryImpairment}
                                onValueChange={(value) => setSensoryImpairment(value)}
                            >
                                <Picker.Item label="No" value="No" />
                                <Picker.Item label="Yes" value="Yes" />
                            </Picker> */}

                            {/* Covid-19 */}
                            {/* <Text style={styles.label}>Covid-19</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={covid}
                                onValueChange={(value) => setCovid(value)}
                            >
                                <Picker.Item label="No" value="No" />
                                <Picker.Item label="Yes" value="Yes" />
                            </Picker> */}

                            {/* Prediction Output  */}
                            {/* Age */}
                            {
                                imageUrl ? <View style={{ alignSelf: 'center' }}>
                                    <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200, marginBottom: 30 }} />
                                </View> : ""
                            }

                            <Text style={styles.label}>Prediction</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Prediction..."
                                value={predictionOutput}
                                onChangeText={(text) => setPredictionOutput(text)}
                            />


                            {/* Any other findings */}
                            <Text style={styles.label}>Any other findings</Text>
                            <TextInput
                                style={styles.inputBox}
                                placeholder="Enter any other findings..."
                                value={anyOtherFindings}
                                onChangeText={(text) => setAnyOtherFindings(text)}
                                multiline={true}
                                numberOfLines={5}
                            />

                            {/* Loading  */}
                            {loading && (
                                <View>
                                    <ActivityIndicator size="large" color="#008AE9" />
                                </View>
                            )}

                            {/* Submit Button */}
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} >
                                <Text style={styles.submitText}>Submit</Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                )
            }
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    inputBox: {
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        textAlignVertical: 'top',
        borderRadius: 10
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
        backgroundColor: "white",
    },
    submitButton: {
        backgroundColor: '#008AE9',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 70
    },
    submitText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    documentButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    documentButtonText: {
        color: 'white',
        textAlign: 'center',
    },

    file: {
        backgroundColor: '#008AE9',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 70
    },
    pickImageOuterContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 10,
        marginTop: 25,
    },
    pickImage: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    openFileBtn: {
        marginRight: 10
    },
    predictSyle: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 2,
        marginBottom: 15,
    }

});

export default EditData