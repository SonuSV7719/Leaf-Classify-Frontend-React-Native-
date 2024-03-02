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
    Button,
    Image,
    Pressable
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FIREBASE_DB } from '../components/firebaseConfig';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FIREBASE_STORAGE } from '../components/firebaseConfig';

const FormData = global.FormData;

const RegisterPatient = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [residentOf, setResidentOf] = useState('');
    const [bloodGroup, setBloodGroup] = useState('A+');
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
    const [uploadImageLoading, setUploadImageLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [imageType, setImageType] = useState('');
    const [predictionOutput, setPredictionOutput] = useState("");

    const [classifyLoading, setClassifyLoading] = useState(false)

    const [showAlert, setShowAlert] = useState(false);

    const [plantName, setPlantName] = useState('Potato')

    const db = FIREBASE_DB;
    const router = useRouter();
    const storage = FIREBASE_STORAGE;

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setImageType(result.assets[0].uri.substring(result.assets[0].uri.lastIndexOf(".") + 1));
        }
    };

    const uploadImage = async () => {
        if (image) {
            try {
                setUploadImageLoading(true);
                setStatus('Uploading...');

                const response = await fetch(image);
                const blob = await response.blob();

                const storageRef = ref(storage, 'images/' + new Date().getTime());
                const snapshot = await uploadBytes(storageRef, blob);

                const url = await getDownloadURL(snapshot.ref);
                // console.log(url)
                if (url) {
                    setImageUrl(url);
                }

                setStatus('');
                setUploadImageLoading(false);
            } catch (err: any) {
                setUploadImageLoading(false);
                // console.error(err);
                Alert.alert('Error uploading image', err.message);
            }
        } else {
            Alert.alert('First choose an image');
        }
    };

    const classifyImage = async () => {
        const apiUrl = 'https://classifynow.onrender.com/predict';

        try {
            setClassifyLoading(true)
            setStatus("Classifying...")
            let formData = new FormData();
            formData.append('image', {
                uri: image,
                name: new Date() + 'image.' + imageType,
                type: 'image/' + imageType
            });

            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const data = await response.json();
            // console.log('Prediction:', data.predicted_class);
            if (data.predicted_class == 0) {
                setPredictionOutput("Left Loop")
            } else if (data.predicted_class == 1) {
                setPredictionOutput("Plain Arch")
            } else if (data.predicted_class == 2) {
                setPredictionOutput("Right Loop")
            } else if (data.predicted_class == 3) {
                setPredictionOutput("Tented Arch")
            } else {
                setPredictionOutput("Whorl")
            }
            setClassifyLoading(false)
            setStatus("")
        } catch (error) {
            setClassifyLoading(false)
            setStatus("")
            Alert.alert('Error:' + error);
        }


    }


    const handleSubmit = async () => {
        const data = {
            imageUrl : imageUrl,
            name: plantName,
            predictedClass: predictionOutput,
            anyOtherFindings : anyOtherFindings,
            createdAt: serverTimestamp()
        }
        setLoading(true);
        try {
            const docRef = await addDoc(collection(db, "patient"), data);
            // console.log("Document written with ID: ", docRef.id);
            Alert.alert("Data Saved!")
            if (docRef) {
                router.back();
            }
        } catch (e: any) {
            Alert.alert("Error: " + e);
            // console.error("Error adding document: ", e);
        }
        setLoading(false)
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.formGroup}>
                {/* name of patient  */}
                <Text style={styles.label}>Name of Plant</Text>
                {/* <TextInput
                    style={styles.input}
                    placeholder="Enter plant..."
                    value={name}
                    onChangeText={(text) => setName(text)}
                /> */}
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
                </Picker> */}


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

                {/* Pick Image  */}
                <View style={styles.pickImageOuterContainer}>
                    {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom: 30 }} />}
                    {uploadImageLoading &&
                        (<View >
                            <Text style={styles.label}>{status}</Text>
                            <ActivityIndicator size="large" color="#008AE9" />
                        </View>)
                    }
                    {
                        classifyLoading ?
                            (<View >
                                <Text style={styles.label}>{status}</Text>
                                <ActivityIndicator size="large" color="#008AE9" />
                            </View>) :
                            predictionOutput ?
                                (
                                    <View >
                                        <TextInput
                                            style={styles.predictSyle}
                                            placeholder="Prediction..."
                                            value={predictionOutput}
                                            onChangeText={(text) => setPredictionOutput(text)}
                                        />
                                    </View>
                                )
                                : ("")
                    }
                    <View style={styles.pickImage}>
                        <View style={styles.openFileBtn}>
                            <TouchableOpacity onPress={pickImage} style={{ backgroundColor: "#ed4005", paddingHorizontal: 15, paddingVertical: 8 }} >
                                <Text style={{ color: '#fff', fontWeight: '700' }}>Open File</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.openFileBtn}>
                            <TouchableOpacity style={{ backgroundColor: "#ed4005", paddingHorizontal: 15, paddingVertical: 8 }} onPress={uploadImage} >
                                <Text style={{ color: '#fff', fontWeight: '700' }}>Upload Image</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={{ backgroundColor: "#ed4005", paddingHorizontal: 15, paddingVertical: 8 }} onPress={classifyImage} >
                                <Text style={{ color: '#fff', fontWeight: '700' }}>Classify</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

                {/* Loading  */}
                {loading && (
                    <View>
                        <ActivityIndicator size="large" color="#008AE9" />
                    </View>
                )}

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>

            </View>
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
        backgroundColor: '#65B741',
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
        marginRight: 10,
        backgroundColor: '#ed4005'
    },
    predictSyle: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 2,
        marginBottom: 15,
    }

});

export default RegisterPatient