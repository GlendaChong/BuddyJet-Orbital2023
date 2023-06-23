import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Image } from 'react-native';
import { Button} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useState, useEffect } from "react";
import { ScrollView, RefreshControl } from "react-native-gesture-handler";
import { supabase } from "../../../lib/supabase";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';


export default function Budget() {
    const router = useRouter();
    const [boolean, setBoolean] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const refresh = () => {
        checkBudget();
        fetchBudgetDetail();
        fetchCategoryDetail();
    }

    //component for no budget

    const CreateBudgetButton = () => {
        return (
            <View style={{marginTop:80}}>
          <Button
          mode="contained" 
          style={styles.createBudgetButton}
          labelStyle={styles.createBudgetText}
          onPress={() => {
            router.push('./Budget/CreateBudget')
            // setBoolean(true)
          }}
          >
            Create a budget
          </Button>
          </View>
        ); 
      };

      const Design = () => {
        return (
          <View style={{marginTop: 360}}>
            <Image style={styles.image} source={require('../../../assets/budget.jpeg')} />
            <Text style={styles.mainText}>No Budget</Text>
            <Text style={styles.descriptionText}>You have not created a budget</Text>
          </View>
        ); 
      }

      //component for when there is budget 
      let [category, setCategory] = useState([]);
      let [monthlyBudget, setMonthlyBudget] = useState(0);
      const [budgetId, setbudgetId] = useState(0)

      //obtain the budget_id that is currently in use 
      const checkBudget = async () => {
        setRefreshing(true)
        let { data: budget, error } = await supabase
            .from('budget')
            .select('budget_id')
            .eq('in_use', true);

        const budget_id = budget[0]?.budget_id
      
        setbudgetId(budget_id);
        console.log(budget_id)
        setRefreshing(false);

          if (budget_id == undefined) {
            setBoolean(false);
          }

          if(budget_id !== undefined) {
            setBoolean(true);
          } 

          if (error) {
            console.error('Error fetching budget', error);
          }

          console.log(boolean)
      }

    useEffect(() => {
        checkBudget();
    },[])

    useEffect(() => {
        if (refreshing) {
            checkBudget();
            setRefreshing(false);
        }
        
    },[refreshing])

    

    const fetchBudgetDetail = async () => {
        setRefreshing(true)
      let {data: budget } = await supabase.from('budget').select('income').eq('in_use', true).eq('budget_id', budgetId)

      const income = parseInt(budget[0]?.income);
      setMonthlyBudget(income);
      setRefreshing(false)
    }

    
    const fetchCategoryDetail = async () => {
        setRefreshing(true);
      let {data: categoryData} = await supabase.from('categories').select('category, spending, color').eq('in_use', true).eq('budget_id', budgetId)
      setCategory(categoryData);
      console.log(categoryData)
      setRefreshing(false);
    }

    useEffect(() => {
        if (budgetId != null) {
          fetchBudgetDetail();
          fetchCategoryDetail();
        }
        
      }, [budgetId]);

      useEffect(() => {
        if (refreshing) {
          fetchBudgetDetail();
          fetchCategoryDetail();
          setRefreshing(false);
        }
        
      }, [refreshing]);


    const BudgetBox = () => {
      return (
        <View style={{ marginTop: -15, flex: 1}}>
          <Text onPress={()=> {router.push('../Budget/EditBudget');}} style={{fontFamily: 'Poppins-Regular' , left: 280, marginBottom:10}} > Edit</Text> 
      <View  style={{backgroundColor: '#000E90', borderRadius: 18, paddingHorizontal: 30, paddingTop: 15, paddingBottom:8}}>
        {category.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} >
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color, marginRight: 20 }} />
              <Text style={{ fontFamily: 'Poppins-Medium', width: 120, color:'#fff'}}>{item.category}</Text>
              <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize:18, width: 85, color:'#fff'}}>${(monthlyBudget * item.spending).toFixed(0)}</Text>
              <Text style={{ fontFamily: 'Poppins-Medium', width: 30, color:'#fff'}}>{`${(item.spending * 100).toFixed(0)}%`}</Text>
          </View>
        ))}
     </View>
     </View>
      );
    }


    const FinancialTip = () => {
      return (
        <View style={{ paddingHorizontal: 10, paddingTop: 35 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginRight: 10 }}>
              <FontAwesomeIcon icon={faLightbulb} size={30} style={{ color: "#FF9F1A" }} />
            </View>
            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20, marginBottom: 4 }}>Financial Tip</Text>
          </View>
          <View style={{ marginLeft: 40 }}>
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, marginBottom: 4, width: 285, marginTop: 20, marginLeft: -30, lineHeight: 28 }}>
              Save regularly: Make saving a priority by setting aside a portion of your income each month. Start with a small amount and gradually increase it over time.
            </Text>
          </View>
        </View>
      );
    }

    
    
    

    //checking if there is budget
   if (boolean) {
    //The page for when there is a budget 
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" , backgroundColor: "#fff"}}>
        <ScrollView
         refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          >

          <View style={{ alignItems: 'center' }}>
        <Text style={{fontFamily:'Poppins-Regular', color:'#2C2646', marginTop: 20}}>Monthly Budget</Text>
        <Text style={{fontFamily:'Poppins-SemiBold', color:'#2C2646', fontSize:48, marginTop: 0}}>${monthlyBudget}</Text>
        <BudgetBox />
        </View>
        <FinancialTip />
        </ScrollView>
      </SafeAreaView>
    );
    } else {
    //The page for when there is  no budget
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" , backgroundColor: "#fff"}}>
            <ScrollView
             refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={checkBudget} />
              }>
            <Design />
            <CreateBudgetButton /> 
            </ScrollView>
        </SafeAreaView>
    ); 
      }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },

      image: {
        position: 'absolute', 
        width: 254,
        height: 240,
        alignSelf: 'center',  
        top: -230, 
      }, 

      mainText: {
        fontFamily: 'Poppins-SemiBold', 
        fontSize: 35, 
        lineHeight: 52, 
        top: 35,
        color: '#100D40',
        textAlign: 'center', 
      },

      descriptionText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        opacity: 0.65, 
        lineHeight: 24, 
        top: 45, 
        color: '#100D40',
        textAlign: 'center', 
      }, 


      createBudgetButton: {
        position: 'absolute', 
        left:20 ,
        top: "80.72%", 
        width: 250,
        backgroundColor: '#3D70FF',
        borderRadius: 40, 
      }, 

      createBudgetText: {
        fontFamily: 'Poppins-SemiBold', 
        fontWeight: 600, 
        fontSize: 18, 
        lineHeight: 30, 
        textAlign: 'center',
        color: '#fff'
      },
    });  