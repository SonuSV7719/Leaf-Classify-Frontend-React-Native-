import React from 'react';
import { View, StyleSheet, Text, Button, Alert, Pressable, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../components/firebaseConfig';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const Home = () => {
    const router = useRouter();

    const goToPatientRegister = () => {
        router.push('/RegisterPatient')
    }

    const goToPatientList = () => {
        router.push('/PatientList')
    }

    const handleLogout = async () => {
        try {
            await FIREBASE_AUTH.signOut();
            router.replace('/(tabs)/Login')
        } catch (error) {
            Alert.alert('Error occurred during logout' + error);
        }
    };
    return (
        <View style={styles.container}>
            <Pressable style={styles.card} onPress={goToPatientRegister}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Enter Leaf Details</Text>
                </View>
                <View style={styles.cardContent}>
                    <Entypo name="leaf" size={100} color="#65B741" />
                </View>
            </Pressable>

            <Pressable style={styles.card} onPress={goToPatientList}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Leaf Database</Text>
                </View>
                <View style={styles.cardContent}>
                    <FontAwesome name="list-alt" size={100} color="#65B741" />
                </View>
            </Pressable>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: "70%",
        height: 200,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardHeader: {
        backgroundColor: '#ed4005',
        padding: 12,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color : '#fff'
    },
    cardContent: {
        padding: 16,
        alignSelf: 'center'
    },
    button: {
        backgroundColor: '#ed4005',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginTop: 20,
        alignSelf: 'center',
        marginHorizontal: "25%",
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Home;
