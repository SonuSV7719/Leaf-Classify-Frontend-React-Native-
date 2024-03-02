import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../components/firebaseConfig';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
// import { useColorScheme } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  // const colorScheme = useColorScheme();
  const db = FIREBASE_DB;
  const getAllData = async (collectionName: any) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data: { id: string; }[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    return data;
  };

  const convertToCSV = (data : any) => {
    // Get all unique keys from the data
    const keys = data.reduce((allKeys: string[], currentItem: {}) => {
      Object.keys(currentItem).forEach((key) => {
        if (!allKeys.includes(key)) {
          allKeys.push(key);
        }
      });
      return allKeys;
    }, []);
  
    // Create headers from the keys
    const headers = keys.join(',') + '\n';
  
    // Append each row
    const rows = data.map((item : any) => {
      const row = keys.map((key: string | number) => (item[key] !== undefined ? item[key] : 'NA'));
      return row.join(',');
    });
  
    // Concatenate headers and rows
    const csv = headers + rows.join('\n');
    return csv;
  };
  
  
  const handleDownload = async () => {
    const collectionName = 'patient';
    try {
      const retrievedData = await getAllData(collectionName);
      // console.log(retrievedData)
      const csvData = convertToCSV(retrievedData);
  
      const localUri = FileSystem.documentDirectory + 'data.csv';
  
      await FileSystem.writeAsStringAsync(localUri, csvData);
      // console.log('CSV file created at:', localUri);
  
      await Sharing.shareAsync(localUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Share CSV file',
        UTI: 'public.comma-separated-values-text',
      });
    } catch (error) {
      Alert.alert('Error getting or sharing CSV file:'+ error);
    }
  };

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="forgetPassword" options={{ title: "Forget Password" }} />
      <Stack.Screen name="Home" options={{ title: "Home" }} />
      <Stack.Screen name="RegisterPatient" options={{ title: "Enter Leaf Details" }} />
      <Stack.Screen name="PatientList" options={{
        title: "Leaf Database", headerRight: () => (
          <TouchableOpacity onPress={handleDownload}>
            <MaterialIcons name="file-download" size={24} color="black" />
          </TouchableOpacity>
        ),
      }} />
      <Stack.Screen name="EditData" options={{ title: "Edit Leaf Data" }} />
    </Stack>

  );
}
