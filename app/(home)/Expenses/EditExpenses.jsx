import { Text, StyleSheet, View, KeyboardAvoidingView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, React, useEffect } from "react";
import TextFieldInput from "../../components/TextFieldInput";
import BackButton from "../../components/BackButton";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, Button } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Dropdown } from 'react-native-element-dropdown';
import * as ImagePicker from "expo-image-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleMinus } from "@fortawesome/free-solid-svg-icons";

function EditExpenses() {

  const { expensesId } = useLocalSearchParams();
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');
  const [pic, setPic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const router = useRouter();

  // Fetch backend data
  const fetchExpense = async () => {
    setLoading(true); 
    try {
      const { data } = await supabase
        .from('expenses')
        .select()
        .eq('id', expensesId)
        .single();

      setDescription(data.description);
      setAmount(data.amount);
      setDate(data.date.split('-').reverse().join('/')); // Format the date from yyyy-mm-dd to dd/mm/yyyy
      setSelectedCategory(data.category);
      setSelectedPaymentMode(data.payment_mode);
      setPic(data.pic_url);
      setLoading(false); 

    } catch (error) {
      console.error('Error fetching expense', error);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [expensesId]);


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
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={categories}
        maxHeight={300}
        labelField="label"
        valueField="value"
        value={selectedCategory}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setSelectedCategory(item.value);
          setIsFocus(false);
        }}
      />
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
    );
  };

  const Picture = () => {
    return (
      <View style={{ backgroundColor: "#F3F6FA", marginTop: 20, marginHorizontal: 33, borderRadius: 15, }}>
        <TouchableOpacity style={{
          backgroundColor: "#F3F6FA",
          borderRadius: 15,

        }} onPress={handleSelectPicture}>
          {pic !== null ? (
            <Text style={{ fontFamily: "Poppins-Medium", color: "#0A84FF", fontSize: 18, padding: 15, marginLeft: 10 }}>Choose Another Image</Text>
          ) : (
            <Text style={{ fontFamily: "Poppins-Medium", color: "#0A84FF", fontSize: 18, padding: 15, marginLeft: 10 }}>Add Image</Text>
          )}
        </TouchableOpacity>
        {pic !== null ? (
          <View>
            <View style={{ borderBottomColor: "grey", borderBottomWidth: 0.4, marginBottom: 30 }} />
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={handleDeletePic}>
                <FontAwesomeIcon icon={faCircleMinus} color="#FF453A" size={25} style={{ marginTop: 30, marginHorizontal: 25 }} />
              </TouchableOpacity>
              <Image
                source={{ uri: pic }}
                style={{ width: 80, height: 80, borderRadius: 18, marginBottom: 20 }}
              />
            </View>
          </View>
        ) : (
          <Image
            source={{
              url: "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg",
            }}
            style={{ width: 0, height: 0, borderRadius: 0 }}
          />
        )}
      </View>
    )
  }

  const handleSelectPicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setPic(result.assets[0].uri);
    }
  };

  const handleDeletePic = () => {
    setPic(null);
  }

  // Update data in backend
  const handleEdit = async () => {
    // Get the picture url to store in expenses table
    if (pic !== null) {
        // Insert picture into supabase storage
        const { data, error: uploadError } = await supabase.storage
        .from("expensesPic")
        .upload(`${new Date().getTime()}`, {
          uri: pic,
          type: "jpeg",
          name: "name.jpeg",
        });

      if (uploadError) {
        console.error("Error uploading picture:", uploadError);
        return;
      }

      // Retrieve picture url from supabse storage
      const { data: { publicUrl }} = supabase.storage.from("expensesPic").getPublicUrl(data.path);
      setPic(publicUrl); 
    }

    // Reformat the date from DD/MM/YYYY to YYYY/MM/DD for Supabase
    const [day, month, year] = date.split('/');
    const reformattedDate = `${year}/${month}/${day}`;

    try {
      await supabase
      .from('expenses')
      .update({
        description: description,
        date: reformattedDate,
        amount: amount,
        category: selectedCategory,
        payment_mode: selectedPaymentMode, 
        pic_url: pic
      })
      .eq('id', expensesId);

      router.back();

    } catch (error) {
      setErrMsg(error);
      console.error('Error updating expense', error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })} // Adjust this value as per your requirement
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Text style={styles.headerText}>Entry</Text>
          <Text style={styles.subHeaderText}>Edit your expenses entry</Text>
          <BackButton />
          <TextFieldInput label='Description' value={`${description}`} onChangeText={setDescription} />
          <TextFieldInput label='Date (DD/MM/YYYY)' value={`${date}`} onChangeText={setDate} />
          <TextFieldInput label='Amount' value={`${amount}`} onChangeText={setAmount} />
          <Text style={styles.textfieldName}>Category</Text>
          <CategoryField />
          <Text style={styles.textfieldName}>Payment Mode</Text>
          <PaymentModeField />
          <Text style={styles.textfieldName}>Image (Optional)</Text>
          <Picture />

          <Button
            style={styles.editExpenseButton}
            labelStyle={styles.editExpenseText}
            onPress={() => {
              handleEdit();
            }}
          >
            Edit Expense
          </Button>

          {errMsg !== '' && <Text>{errMsg}</Text>}
          {loading && <ActivityIndicator />}
        </ScrollView>
      </KeyboardAvoidingView>
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
  editExpenseButton: {
    backgroundColor: "#3D70FF",
    borderRadius: 40,
    marginHorizontal: 30,
    marginTop: 50,
    marginBottom: 10,
    width: 330,
    alignSelf: 'center',
  },
  editExpenseText: {
    color: "white",
    fontFamily: "Poppins-SemiBold",
    fontWeight: 600,
    fontSize: 18,
    lineHeight: 40,
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
    backgroundColor: "rgb(237, 221, 246)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    paddingHorizontal: 20,
    paddingRight: 20,
    left: 30,
    marginTop: 10,
    marginRight: 60
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

export default EditExpenses; 