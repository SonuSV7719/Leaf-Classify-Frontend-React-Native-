import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const AlertWithButtons = ({ visible , message, onYesPress, onNoPress }) => {
  return (
    <Modal
      animationType='none'
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 5, borderColor : 'gray', borderWidth : 1 }}>
          <Text>{message}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
            <TouchableOpacity onPress={onYesPress} style = {styles.button}>
              <Text style={{ fontWeight: 'bold', alignSelf : 'center' }}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onNoPress} style = {styles.button}>
              <Text style={{ fontWeight: 'bold', alignSelf : 'center' }}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
    button :{
        width : 50,
        backgroundColor : '#008AE9',
        justifyContent : 'center',
        height : 25,
        borderRadius : 5
    }
})

export default AlertWithButtons

