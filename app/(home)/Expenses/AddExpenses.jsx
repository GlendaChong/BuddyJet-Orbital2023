import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, memo} from "react";
import TextFieldInput from "../../components/TextFieldInput";
import BackButton from "../../components/BackButton";
import { ScrollView } from "react-native-gesture-handler";
import { useAuth } from "../../../contexts/auth";
import { ActivityIndicator, Button } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useRouter, useLocalSearchParams } from "expo-router";
import SelectDropdown from 'react-native-select-dropdown'; 
import { P } from "@expo/html-elements";

function AddExpenses() {

  // // Get list of categories from backend database
  // const [categories, setCategories] = useState([]);
  
  // async function fetchCategories() {
  //     let { data, error } = await supabase.from('categories').select('*');
   
  //     if (error) {
  //       console.error("Error fetching categories:", error);
  //       return;
  //     }

  //     setCategories(data);
      
  // }
  
  // useEffect(() => {
  //     fetchCategories();
  // }, []);
    
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
    const categories = ["Food", "Transport", "Entertainment", "Bills", "Investments"];  
    return (
      <SelectDropdown 
        // data={categories.map(categories => categories.category)}
        data={categories}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem); 
        }}
        defaultButtonText="Select Categories"
        buttonTextAfterSelection={(selectedItem, index) => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          return selectedItem; 
        }}
        rowTextForSelection={(item, index) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          return item;
        }}
        buttonStyle={styles.dropdownButton}
        buttonTextStyle={styles.dropdownText}
      />
    ); 
  }

  // Dropdown selection for payment mode field
  const PaymentModeField = () => {
    const paymentModes = ["Cash", "Debit Card", "Credit Card", "E-Payment"];  
    return (
      <SelectDropdown 
        data={paymentModes}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem, index); 
          // setSelectedPaymentMode(selectedItem); 
        }}
        defaultButtonText="Select Payment Mode"
        buttonTextAfterSelection={(selectedItem, index) => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          return selectedItem; 
        }}
        rowTextForSelection={(item, index) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          return item; 
        }}
        buttonStyle={styles.dropdownButton}
        buttonTextStyle={styles.dropdownText}
      />
    ); 
  }

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
    // if (selectedCategory === '') {
    //   setErrMsg('Category cannot be empty')
    //   return; 
    // }
    // if (selectedPaymentMode === '') {
    //   setErrMsg('Payment mode cannot be empty')
    //   return; 
    // }

    setLoading(true); 

    const { error } = await supabase.from('expenses')
      .insert({ description: description, user_id: user.id, date: date, amount: amount, category: selectedCategory, payment_mode: selectedPaymentMode})
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
          <TextFieldInput label='Date' value={date} onChangeText={setDate} />
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
  dropdownButton: {
    width: 327, 
    left: 30,
    fontFamily: 'Poppins-Medium',
    borderRadius: 4, 
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 3,
    marginTop: 10, 
    backgroundColor: "rgb(237, 221, 246)"
  }, 
  dropdownText: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
  }, 
  categoryButton: {
    width: 327, 
    left: 32,
    fontFamily: 'Poppins-Medium',
    color: 'black',
    borderRadius: 4, 
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 3,
    marginTop: 10, 
    backgroundColor: "rgb(237, 221, 246)",
    justifyContent: 'center', 
    textAlign: 'center', 
    height: 50, 
  }
}); 

export default AddExpenses; 