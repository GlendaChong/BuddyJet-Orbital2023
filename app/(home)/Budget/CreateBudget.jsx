import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Button } from 'react-native-paper';
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import TextFieldInput from "./TextFieldInput";
import { ScrollView } from "react-native-gesture-handler";
import BackButton from "../../components/BackButton";
import { supabase } from "../../../lib/supabase";
import { GetCurrentBudget } from "../GetBackendData";


const MakeBudgetButton = () => {
  const router = useRouter(); 

  return (
    <View style={{ top: 120}} >
      <View style={{ bottom: 130, paddingHorizontal: 28, paddingVertical: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#C2C8D0' }} />
          <View>
            <Text style={{ width: 50, textAlign: 'center', color: '#2D333A' }}>OR</Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: '#C2C8D0' }} />
        </View>
      </View>
      <Button
        mode="contained"
        style={styles.MakeBudgetButton}
        labelStyle={styles.MakeBudgetText}
        onPress={() => {
          router.push('./MakeBudget')
        }}
      >
        Make your own budget
      </Button>
    </View>
  );
};


function CreateBudget() {
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState('');
  const [errMsg, setErrMsg] = useState('');
  // const [budget, setNewBudget] = useState([]); 
  const { selectedMonth, selectedYear, monthIndex } = useLocalSearchParams(); 
  const budgetStartDate = `${selectedYear}-${monthIndex.toString().padStart(2, '0')}-01`; 

  const Budget1Desc = () => {
    const router = useRouter(); 
  
    return (
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.roundedRect}>
            <View style={{ flexDirection: 'row'}}>
              <FontAwesomeIcon
                icon={faCircle}
                style={{ color: '#64D2FF', left: 29 }}
                size={15}
              />
              <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#2C2646',  fontSize: 17, left: 70, bottom: 5 }}>Savings :  20% </Text>
            </View>
            
            <View style={{ flexDirection: 'row' }}>
              <FontAwesomeIcon
                icon={faCircle}
                style={{ color: '#BF5AF2', left: 29 }}
                size={15}
              />
              <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#2C2646',  fontSize: 17 , left: 70, bottom: 5 }}>Food :  25% </Text>
            </View>
  
            <View style={{ flexDirection: 'row' }}>
              <FontAwesomeIcon
                icon={faCircle}
                style={{ color: '#0A84FF', left: 29 }}
                size={15}
              />
              <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#2C2646', fontSize: 17, left: 70, bottom: 5 }}>Transport :  15% </Text>
            </View>
  
            <View style={{ flexDirection: 'row' }}>
              <FontAwesomeIcon
                icon={faCircle}
                style={{ color: '#F46040', left: 29 }}
                size={15}
              />
              <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#2C2646', fontSize: 17, left: 70, bottom: 5 }}>Recreation :  30% </Text>
            </View>
  
            <View style={{ flexDirection: 'row' }}>
              <FontAwesomeIcon
                icon={faCircle}
                style={{ color: '#32D74B', left: 29 }}
                size={15}
              />
              <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#2C2646', fontSize: 17, left: 70, bottom: 5 }}>Bills :  10% </Text>
            </View>
  
          </View>
  
      <View style={{top: 40, right: 45 }}>
        <TouchableOpacity onPress={() => {
            handleSubmit(); 
            router.push('./');
            }} 
        >
          <FontAwesomeIcon
              icon={faChevronRight}
              size={25}
          />
        </TouchableOpacity>
        </View >
      </View>
    );
  };
  
  
  const SampleBudget = () => {
    return (
      <View style={{ padding: 35 }}>
        <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#2C2646', fontSize: 18 }}>Sample Budget</Text>
        <Text style={{ fontFamily: 'Poppins-Regular', color: '#2C2646', fontSize: 13, top: 10 }}>Basic needs budget</Text>
        <Budget1Desc />
      </View>
    );
  };


  const updateData = async () => { 
    // Obtain the user_id from the profile database 
    let { data: profiles } = await supabase
    .from('profiles')
    .select('id'); 
  
    const selectedID = profiles[0]?.id;

    if (income == '') {
      setErrMsg("Income cannot be empty")
      return;
    }

    setLoading(true);  

    try {
      // Insert new budget into backend
      const updates = {
        income: income, 
        user_id: selectedID,
        created_at: budgetStartDate, 
      };    

      await supabase.from('budget').insert([updates]);
    
      // Get the current budget of the month
      const budget = await GetCurrentBudget(selectedMonth, selectedYear); 

      // Insert data into category table
      await supabase.from('categories').insert([
        { created_at: budgetStartDate, user_id: selectedID, budget_id: budget.budget_id, category: 'Food', spending: 0.25, color: '#BF5AF2' }
        , { created_at: budgetStartDate, user_id: selectedID, budget_id: budget.budget_id, category: 'Transport', spending: 0.15, color: '#0A84FF' }
        , { created_at: budgetStartDate, user_id: selectedID, budget_id: budget.budget_id, category: 'Recreation', spending: 0.3, color: '#F46040' }
        , { created_at: budgetStartDate, user_id: selectedID, budget_id: budget.budget_id, category: 'Bills', spending: 0.10, color: '#32D74B' }
        , { created_at: budgetStartDate, user_id: selectedID, budget_id: budget.budget_id, category: 'Saving', spending: 0.20, color: '#64D2FF' }
      ]);

      console.log('Can insert budget'); 

    } catch (error) {
      console.log('Error in inserting data'); 
    }
  }
  
  // Handle the submission for budget
  const handleSubmit = async () => {
    updateData();
  }
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView>
        <BackButton />
        <Text style={styles.CreateText}>Create</Text>
        <Text style={styles.DescriptionText}>A budget</Text>
        <TextFieldInput label='Income' value={income} onChangeText={setIncome} />
        <SampleBudget />
        <MakeBudgetButton />
      </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },


  CreateText: {
    position: 'absolute',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: 600,
    fontSize: 35,
    lineHeight: 52,
    width: 122,
    marginTop: 45,
    left: 30,
    alignContent: 'center',
    color: '#100D40',
  },

  DescriptionText: {
    position: 'absolute',
    fontFamily: 'Poppins-Regular',
    fontWeight: 600,
    fontSize: 17,
    lineHeight: 52,
    width: 289,
    marginTop: 85,
    left: 34,
    alignContent: 'center',
    color: '#100D40',

  },

  roundedRect: {
    width: 311,
    height: 260,
    backgroundColor: '#F3F6FA',
    borderRadius: 18,
    top: 20,
    alignContent: 'center',
    flexDirection: 'column', 
    justifyContent: 'space-evenly'
  },

  MakeBudgetButton: {
    backgroundColor: '#3D70FF',
    borderRadius: 40,
    width: 327,
    height: 56,
    left: 30,
    bottom: 130

  },
  MakeBudgetText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: 600,
    fontSize: 18,
    lineHeight: 35,
    textAlign: 'center',
  },

},
);

export default CreateBudget; 