import { Text, View, TextInput, StyleSheet, Button } from "react-native"; 
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import { ScrollView } from "react-native-gesture-handler";
import { supabase } from "../../../lib/supabase";
import React, { useState, useEffect } from 'react';

function EditBudget() {

    let [budgetId, setbudgetId] = useState(0)
    let [userId, setUserId] = useState('')
    const [category, setCategory] = useState([]);
    const [editing, setEditing] = useState(false);
    const [oldIncome, setOldIncome] = useState(0);
    const [newIncome, setNewIncome] = useState(0);

    const fetchUserId = async () => {
        try {
          let { data: profiles } = await supabase
            .from('profiles')
            .select('id')
      
          const UserID = profiles[0]?.id;
          setUserId(UserID);
        } catch (error) {
          console.error('Error fetching userId', error);
        }
      };

    const fetchbudgetId = async () => {
        try {
          let { data: budget } = await supabase
            .from('budget')
            .select('budget_id')
            .eq('in_use', true);
      
          const BudgetID = budget[0]?.budget_id;
          console.log(BudgetID);
          setbudgetId(BudgetID);
        } catch (error) {
          console.error('Error fetching budgetId', error);
        }
      };

    const fetchOldIncome = async () => {
      let { data: budget, error } = await supabase
          .from('budget')
          .select('income')
          .eq('in_use', true);
        
      if (error) {
        console.error('Error fetching income', error);
        return;
      }
  
      const fetchedIncome = parseInt(budget[0]?.income);
      setOldIncome(fetchedIncome);
      setNewIncome(fetchedIncome);
    };

    const fetchCategoryDetail = async () => {
      let { data: categoryData } = await supabase
        .from('categories')
        .select('category, spending, color, category_id')
        .eq('in_use', true)
        .eq('budget_id', budgetId);
      setCategory(categoryData);
    };

      useEffect(() => {
        fetchUserId();
        fetchbudgetId();
        fetchOldIncome();
      }, []);

      useEffect(() => {
        fetchCategoryDetail();
      }, [])

    const updateIncome = async () => {
      console.log(newIncome)
      try {
        await supabase
          .from('budget')
          .update({ income: newIncome, in_use: true })
          .eq('budget_id', budgetId)
          .eq('user_id', userId);
        console.log('Income updated successfully');
        fetchOldIncome();
      } catch (error) {
        console.error('Error updating income:', error.message);
      }
    };
    
    const Income = ({ onEdit }) => {
      const handleEdit = () => {
        setEditing(true);
      };
      const handleSave =  () => {
        // Perform any necessary validation or API calls to save the new income
        // Once saved successfully, exit editing mode and call the onEdit callback function
        setOldIncome(newIncome)
        setEditing(false);
        updateIncome();
      };
      
      if (editing) {
        return (
            <View style={styles.container}>
              <View style={styles.incomeContainer}>
                <Text style={styles.labelText}>New Income:</Text>
                <TextInput
                  value={newIncome.toString()}
                  onChangeText={setNewIncome}
                  keyboardType="numeric"
                  style={styles.input}
                  autoFocus
                />
                <Text style={{marginTop: -30, left: 70}}onPress={handleSave}>Save</Text>
              </View>
            </View>
        );
      }
      
      return (
        <View style={{alignItems:'center', marginTop: 30}}>
        <View style={{backgroundColor: "#F3F6FA", borderRadius:20, width:280, height: 90, justifyContent:'center', alignItems:'center', marginBottom:0}}>
          <Text style={{color:'#2C2646', fontFamily:'Poppins-Medium', fontWeight:'600', fontSize:18, lineHeight:20, textAlign:'center'}}>Income:</Text>
          <Text style={{color:'#2C2646', fontFamily:'Poppins-SemiBold', fontWeight:'600', fontSize:24, lineHeight:26, textAlign:'center', marginTop:15}}>${oldIncome}</Text>
        </View>
        <Text onPress={handleEdit}style={{bottom:38, left:100}}>Edit</Text>
        </View>
      );
    };

        
    const updateCategory = async (updatedCategories) => {
      try {
        await Promise.all(
          updatedCategories.map((category) =>
            supabase
              .from('categories')
              .update({ category: category.category, spending: category.percentage / 100 })
              .eq('budget_id', budgetId)
              .eq('user_id', userId)
              .eq('category_id', category.category_id)
              .eq('in_use', true)
          )
        );
        console.log('Categories updated successfully');
        fetchCategoryDetail();
      } catch (error) {
        console.error('Error updating categories:', error.message);
      }
    };
    
    const SpendingBox = () => {
      const [percentages, setPercentages] = useState([]);
      const [errorMessage, setErrorMessage] = useState('');
    
      useEffect(() => {
        // Initialize the percentages array with default values based on the category data
        const initialPercentages = category.map((item) => ({
          category: item.category,
          percentage: item.spending * 100,
        }));
        setPercentages(initialPercentages);
      }, [category]);
    
      const handlePercentageChange = (category, value) => {
        // Update the percentage value for a specific category
        const updatedPercentages = percentages.map((item) =>
          item.category === category ? { ...item, percentage: value } : item
        );
        setPercentages(updatedPercentages);
      };
    
      const handleSave = async () => {
        // Calculate the total sum of percentages
        const totalPercentage = percentages.reduce((sum, item) => sum + parseFloat(item.percentage || 0), 0);
    
        // Perform the validation
        if (totalPercentage !== 100) {
          setErrorMessage('Percentage sum is not equal to 100.');
          return;
        }

        const updatedCategories = category.map((item, index) => ({
          ...item,
          category: percentages[index]?.category || item.category,
          percentage: percentages[index]?.percentage || item.spending * 100,
        }));

        // Perform any necessary API calls or save the data
        await updateCategory(updatedCategories);
        console.log('Updated Percentages:', percentages);
        setErrorMessage('');
        setCategory(updatedCategories);
      };
    
      return (
        <View style={{ marginTop: 30, flex: 1, paddingHorizontal: 30, alignContent: 'center' }}>
          <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 18, marginBottom: 15 }}> Categories:</Text>
          <View
            style={{
              backgroundColor: '#F3F6FA',
              borderRadius: 18,
              paddingLeft: 30,
              paddingTop: 20,
              paddingBottom: 8,
              width: 320,
            }}
          >
            {category.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <View
                  style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color, marginRight: 20 }}
                />
                <Text style={{ fontFamily: 'Poppins-SemiBold', width: 120, color: '#2C2646', fontSize: 16 }}>
                  {item.category}
                </Text>
                <TextInput
                  value={percentages.find((p) => p.category === item.category)?.percentage.toString()}
                  onChangeText={(value) => handlePercentageChange(item.category, value)}
                  keyboardType="numeric"
                  style={{ fontFamily: 'Poppins-Medium', width: 30, color: '#2C2646', left: 50, fontSize: 16 }}
                />
                <Text style={{ fontFamily: 'Poppins-Medium', width: 30, color: '#2C2646', left: 50 }}>%</Text>
              </View>
            ))}
          </View>
          <Text
            onPress={handleSave}
            style={{ fontFamily: 'Poppins-Medium', fontSize: 15, color: '#2C2646', marginTop: 10, left: 260 }}
          >
            Save
          </Text>
          {errorMessage !== '' && <Text style={{ color: 'red', width: 250, top:-20}}>{errorMessage}</Text>}
        </View>
      );
    };

    const MoneyIn = () => {
      const [sideHustles, setSideHustles] = useState([]);
      const [newSideHustle, setNewSideHustle] = useState('');
      const [newSideHustleAmount, setNewSideHustleAmount] = useState('');
      
      useEffect(() => {
        // Fetch the side hustles from Supabase
        fetchSideHustles();
      }, []);
      
      const fetchSideHustles = async () => {
        try {
          const { data, error } = await supabase.from('moneyIn').select('name, amount');
          if (error) {
            throw error;
          }
          setSideHustles(data);
        } catch (error) {
          console.log('Error fetching side hustles:', error.message);
        }
      };
      
      const addSideHustle = async () => {
        try {
          const { data, error } = await supabase.from('moneyIn').insert([{ user_id: userId, name: newSideHustle, amount: newSideHustleAmount }]);
          if (error) {
            throw error;
          }
          setNewSideHustle('');
          setNewSideHustleAmount('');
          fetchSideHustles(); // Fetch the updated side hustles after adding a new one
        } catch (error) {
          console.log('Error adding side hustle:', error.message);
        }
      };
      
      return (
        <View style={{ marginTop: 30, flex: 1, paddingHorizontal: 40, alignContent: 'center' }}>
          <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 18, marginBottom:8, left:5 }}>Money In:</Text>
          <View style={{ backgroundColor: '#F3F6FA', borderRadius: 18, paddingHorizontal: 30, paddingTop:20, marginTop: 10 }}>
            {sideHustles.map((sideHustle) => (
              <View key={sideHustle.name} style={{ flexDirection: 'row', marginBottom: 20 }}>
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, width:100 }}>{sideHustle.name}:</Text>
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, marginLeft: 80}}>${sideHustle.amount}</Text>
              </View>
            ))}
            <View style ={{flexDirection:'row'}}>
            <TextInput
              value={newSideHustle}
              onChangeText={setNewSideHustle}
              placeholder="Money in"
              style={{ width: 100, fontSize:14, fontFamily:'Poppins-Regular' }}
            />
            <TextInput
              value={newSideHustleAmount}
              style={{marginLeft:75, width:100, fontSize:18, fontFamily:'Poppins-SemiBold'}}
              onChangeText={setNewSideHustleAmount}
              placeholder="Amount"
            />
            </View>
          <View style={{marginTop:30}}>
          <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#EAE9F0', width:312, right:30, marginBottomBottom:10 }} />
          <Button title="Add" onPress={addSideHustle} />
          </View>
          </View>
        </View>
      );
    };

  return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", backgroundColor:'white'}}>
          <ScrollView>
              <BackButton />
              <Text style={{fontFamily:'Poppins-SemiBold', fontSize:35, marginTop: 40, marginHorizontal: 30}}>Edit</Text>
              <Income />
              <SpendingBox />
              <MoneyIn />
          </ScrollView>
      </SafeAreaView>
  ); 
}

const styles = {
  container: {
    alignItems: 'center',
    marginTop: 30,
  },
  incomeContainer: {
    backgroundColor: '#F3F6FA',
    borderRadius: 20,
    width: 280,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  labelText: {
    color: '#2C2646',
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: -8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2C2646',
    borderRadius: 5,
    width: 200,
    height: 40,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  editButton: {
    marginTop: 10,
  },
  editButtonText: {
    color: '#3D70FF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  }
}; 


export default EditBudget; 