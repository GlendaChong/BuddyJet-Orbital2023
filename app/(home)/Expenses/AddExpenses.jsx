import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import TextFieldInput from "../../components/TextFieldInput";
import BackButton from "../../components/BackButton";
import { ScrollView } from "react-native-gesture-handler";
import { useAuth } from "../../../contexts/auth";
import { ActivityIndicator, Button } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "expo-router";
import { Dropdown } from 'react-native-element-dropdown';

function AddExpenses() {
    
  const [description, setDescription] = useState(''); 
  const [date, setDate] = useState(''); 
  const [amount, setAmount] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const { user } = useAuth(); 
  const router = useRouter(); 
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');

  // Dropdown selection for category field
  const CategoryField = () => {
    const categories = [
      { label: 'Food', value: 'Food' },
      { label: 'Transport', value: 'Transport' },
      { label: 'Entertainment', value: 'Entertainment' },
      { label: 'Bills', value: 'Bills' },
      { label: 'Investments', value: 'Investments' },
      { label: 'Others', value: 'Others' },
    ];
    const [isFocus, setIsFocus] = useState(false);

    return (
      <View style={styles.dropdownContainer}>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={categories}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          value={selectedCategory}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setSelectedCategory(item.value);
            setIsFocus(false);
          }}
        />
      </View>
    );
  };

  // Dropdown selection for payment mode field
  const PaymentModeField = () => {
    const paymentModes = [
      { label: 'Cash', value: 'Cash' },
      { label: 'Debit Card', value: 'Debit Card' },
      { label: 'Credit Card', value: 'Credit Card' },
      { label: 'E-Payment', value: 'E-Payment' },
      { label: 'Others', value: 'Others' }
    ]; 
    const [isFocus, setIsFocus] = useState(false); 
  
    return (
      <View style={styles.dropdownContainer}>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={paymentModes}
          maxHeight={300}
          labelField="label"
          valueField="value"
          value={selectedPaymentMode}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setSelectedPaymentMode(item.value);
            setIsFocus(false);
          }}
        />
      </View>
    );
  };


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
    if (selectedCategory === '') {
      setErrMsg('Category cannot be empty')
      return; 
    }
    if (selectedPaymentMode === '') {
      setErrMsg('Payment mode cannot be empty')
      return; 
    }

    setLoading(true); 

    // Reformat the date from DD/MM/YYYY to YYYY/MM/DD
    const [day, month, year] = date.split('/');
    const reformattedDate = `${year}/${month}/${day}`;

    const { error } = await supabase.from('expenses')
      .insert({ 
        description: description, 
        user_id: user.id, 
        date: reformattedDate, 
        amount: amount, 
        category: selectedCategory, 
        payment_mode: selectedPaymentMode})
      .select()
      .single();

    if (error != null) {
        setLoading(false);
        console.log(error);
        setErrMsg(error.message);
        return;
    }
    setLoading(false);
    router.back(); 
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
          <Text style={styles.headerText}>Entry</Text>
          <Text style={styles.subHeaderText}>Create a new expenses entry</Text>
          <BackButton />
          <TextFieldInput label='Description' value={description} onChangeText={setDescription} />
          <TextFieldInput label='Date (DD/MM/YYYY)' value={date} onChangeText={setDate} />
          <TextFieldInput label='Amount' value={amount} onChangeText={setAmount} />
          <Text style={styles.textfieldName}>Category</Text>
          <CategoryField />
          <Text style={styles.textfieldName}>Payment Mode</Text>
          <PaymentModeField />
        
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
    marginTop: 50, 
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
  textfieldName: {
    left: 30,
    fontFamily: 'Poppins-Medium',
    fontWeight: 400, 
    fontSize: 17, 
    lineHeight: 26, 
    color: '#100D40', 
    opacity: 0.65,    
    marginTop: 40,      
  },
  dropdown: {
    height: 55,
    borderRadius: 4, 
    paddingHorizontal: 10,
    backgroundColor: 'rgb(237, 221, 246)', 
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 3,
    width: 327, 
    left: 32,
    marginTop: 10, 
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 30, 
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    fontFamily: 'Poppins-Regular', 
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular', 
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular', 
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: 'Poppins-Regular', 
  },
}); 

export default AddExpenses; 