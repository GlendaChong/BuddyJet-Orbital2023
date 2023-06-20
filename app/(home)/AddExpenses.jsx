import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import TextFieldInput from "../components/TextFieldInput";
import BackButton from "../components/BackButton";
import { ScrollView } from "react-native-gesture-handler";
import { supabase } from "../../lib/supabase";


function AddExpenses() {
  const [description, setDescription] = useState(''); 
  const [date, setDate] = useState(''); 
  const [amount, setAmount] = useState(''); 
  // category
  // payment mode
  // location 
  // pictures
  // const [loading, setLoading] = useState(false);
  // const [errMsg, setErrMsg] = useState('');
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView >
          <Text style={styles.headerText}>Entry</Text>
          <Text style={styles.subHeaderText}>Create a new expenses entry</Text>
          <BackButton />
          <TextFieldInput label='Description' value={description} onChangeText={setDescription} />
          <TextFieldInput label='Date' value={date} onChangeText={setDate} />
          <TextFieldInput label='Amount' value={amount} onChangeText={setAmount} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'white', 
  }, 
  headerText: {
    left: 30,
    fontFamily: 'Poppins-SemiBold', 
    fontWeight: 600, 
    fontSize: 45, 
    lineHeight: 68, 
    color: '#100D40', 
    alignContent: 'center',
    marginTop: 40, 
  }, 
  subHeaderText: {
    left: 30,
    fontFamily: 'Poppins-Regular', 
    fontWeight: 400, 
    fontSize: 19, 
    lineHeight: 24, 
    color: '#100D40', 
    opacity: 0.65,     
  }, 
}); 

export default AddExpenses; 