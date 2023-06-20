import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import TextFieldInput from "../../components/TextFieldInput";
import BackButton from "../../components/BackButton";
import { ScrollView } from "react-native-gesture-handler";
import { useAuth } from "../../../contexts/auth";
import { ActivityIndicator, Button } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "expo-router";

function AddExpenses() {
  const [description, setDescription] = useState(''); 
  const [date, setDate] = useState(''); 
  const [amount, setAmount] = useState(''); 
  const [category, setCategory] = useState(''); 
  const [paymentMode, setPaymentMode] = useState(''); 

  // location 
  // pictures

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const { user } = useAuth(); 
  const router = useRouter(); 

  const handleSubmit = async () => {
    setErrMsg(''); 
    if (description === '') {
      setErrMsg('Description cannot be empty')
      return; 
    }
    if (date === '') {
      setErrMsg('Date cannot be empty')
      return; 
    }
    if (amount === '') {
      setErrMsg('Amount cannot be empty')
      return; 
    }
    if (category === '') {
      setErrMsg('Category cannot be empty')
      return; 
    }
    if (paymentMode === '') {
      setErrMsg('Payment mode cannot be empty')
      return; 
    }

    setLoading(true); 

    const { error } = await supabase.from('expenses')
      .insert({ description: description, user_id: user.id, date: date, amount: amount, category: category, payment_mode: paymentMode})
      .select()
      .single();

    if (error != null) {
        setLoading(false);
        console.log(error);
        setErrMsg(error.message);
        return;
    }
    setLoading(false);
    router.push('./Expenses');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
          <Text style={styles.headerText}>Entry</Text>
          <Text style={styles.subHeaderText}>Create a new expenses entry</Text>
          <BackButton />
          <TextFieldInput label='Description' value={description} onChangeText={setDescription} />
          <TextFieldInput label='Date' value={date} onChangeText={setDate} />
          <TextFieldInput label='Amount' value={amount} onChangeText={setAmount} />
          <TextFieldInput label='Category' value={category} onChangeText={setCategory} />
          <TextFieldInput label='Payment Mode' value={paymentMode} onChangeText={setPaymentMode} />
          <Button  
              style={styles.addExpenseButton} 
              labelStyle={styles.addExpenseText} 
              onPress={ () => {
                    handleSubmit();
              }}
          >
              Add Expense
          </Button>
          {errMsg !== '' && <Text>{errMsg}</Text>}
          {loading && <ActivityIndicator />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'white', 
    justifyContent: 'center'
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
  addExpenseButton: {
    backgroundColor: '#3D70FF',
    borderRadius: 40, 
    width: 327, 
    height: 56, 
    marginTop: 120, 
    left: 30, 
    justifyContent: 'center', 
  }, 
  addExpenseText: {
      color: 'white', 
      fontFamily: 'Poppins-SemiBold', 
      fontWeight: 600, 
      fontSize: 18, 
      lineHeight: 35,  
      textAlign: 'center', 
  },
}); 

export default AddExpenses; 