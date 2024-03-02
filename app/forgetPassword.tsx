import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../components/firebaseConfig'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useRouter } from 'expo-router'

const forgetPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const auth = FIREBASE_AUTH
    const resetPassword = () =>  {
        setLoading(true)
        sendPasswordResetEmail(auth, email)
            .then(() => {
                router.back()
                Alert.alert("Reset password email send check your email")

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Alert.alert(errorMessage)
                // ..
            });

        setLoading(false)
    }
    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/login.png')} style={styles.image} />
            <View style={styles.innerContainer}>
                {loading && (
                    <View>
                        <ActivityIndicator size="large" color="#008AE9" />
                    </View>
                )}
                <Text style={styles.text}>
                    Email
                </Text>
                <TextInput style={styles.input} value={email} onChangeText={(text) => setEmail(text)} autoCapitalize='none' />
                <TouchableOpacity style={styles.button} onPress={resetPassword}>
                    <Text style={styles.buttonText}>Reset Password</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        top: 100
    },

    innerContainer: {
        flex: 1,
        alignItems: 'center',
        top: 150
    }
    ,
    image: {
        width: 200,
        height: 200
    },

    text: {
        right: 105,
        bottom: 10
    },

    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 12,
        width: 250,
        borderRadius: 8,
    },

    button: {
        backgroundColor: '#008AE9',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginTop: 20,
        alignSelf: 'flex-end',
        marginHorizontal: "25%",
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
})

export default forgetPassword