import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, KeyboardAvoidingView, Text, View, TextInput, TouchableOpacity, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
// import { Text, View, TextInput } from '../../components/Themed';
import { FIREBASE_AUTH } from '../../components/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

export default function TabOneScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const auth = FIREBASE_AUTH;

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        // console.log('User is already logged in:', user.uid);
        setAuthLoading(false);
        router.replace('/Home')
      } else {
        setAuthLoading(false);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);


  const gotoLogin = () => {
    router.push('/(tabs)/Login');
  };

  const handleRegistration = async () => {
    const emailRegex = /\S+@\S+\.\S+/;

    if (!email || !password) {
      Alert.alert('Empty Fields', 'Please fill in all the fields');
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Password Length', 'Password should be at least 8 characters');
      return;
    }

    setLoading(true);

    if (email && password) {
      try {
        const response = await createUserWithEmailAndPassword(auth, email, password);

        if (response.user) {
          router.push('/(tabs)/Login');
        }
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          Alert.alert("Already Registered with email");
          setLoading(false);
          return;
        }
        Alert.alert("Oops", "Please check your form and try again");
        setLoading(false);
      }
      setLoading(false);
    }
  };


  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Checking Authentication...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/login.png")} style={styles.loginImage} resizeMode='contain' />

      <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 0, padding: 0 }} >
        <Text style={{ fontWeight: '900', fontSize: 30, marginBottom: 20 }}>Register</Text>

        <Text style={styles.label1}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Enter email..."
          autoCapitalize='none'
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          {
            hidePassword ?
              (
                <TextInput
                  style={styles.input1}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  placeholder="Enter password..."
                  secureTextEntry
                  autoCapitalize='none'
                />
              ) : (
                <TextInput
                  style={styles.input1}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  placeholder="Enter password..."
                  autoCapitalize='none'
                />
              )
          }
          {
            hidePassword ? (<TouchableOpacity onPress={togglePasswordVisibility}>
              <Ionicons name="eye-off" size={24} color="black" style={styles.iconEyeOff} />
            </TouchableOpacity>) :
              (<TouchableOpacity onPress={togglePasswordVisibility}>
                <Ionicons name="eye" size={24} color="black" style={styles.iconEyeOff} />
              </TouchableOpacity>)
          }


        </View>

        <Pressable onPress={gotoLogin}>
          <Text style={styles.linkText}>Already Have Account?</Text>
        </Pressable>

        <TouchableOpacity onPress={handleRegistration} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        {loading && (
          <View>
            <ActivityIndicator size="large" color="#008AE9" />
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  loginImage: {
    width: 170,
    marginBottom: -70,
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
  label: {
    right: 90,
    marginVertical: 5,
    color: '#4F504F',
    fontSize: 15,
  },
  label1: {
    right: 105,
    marginVertical: 5,
    color: '#4F504F',
    fontSize: 15,
  },
  linkText: {
    color: 'grey',
  },
  button: {
    backgroundColor: '#008AE9',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input1: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 12,
    width: 250,
    borderRadius: 8,
    left: 10
  },
  iconEyeOff: {
    right: 25,
    bottom: 5
  }
});
