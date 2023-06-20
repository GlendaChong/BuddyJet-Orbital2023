import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Image } from 'react-native';
import { Button} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { supabase } from "../../lib/supabase";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export default function Budget() {
    const router = useRouter();
    let [boolean, setBoolean] = useState(true);


    //component for no budget

    const CreateBudgetButton = () => {
        return (
          <Button
          mode="contained" 
          style={styles.createBudgetButton}
          labelStyle={styles.createBudgetText}
          onPress={() => {
            router.push('../(budgetTabs)/CreateBudget')
            // setBoolean(true)
          }}
          >
            Create a budget
          </Button>
        ); 
      };

      const Design = () => {
        return (
          <View style={{marginTop: 80}}>
            <Image style={styles.image} source={require('../../assets/budget.jpeg')} />
            <Text style={styles.mainText}>No Budget</Text>
            <Text style={styles.descriptionText}>You have not created a budget</Text>
          </View>
        ); 
      }

      //component for when there is budget 
      const [category, setCategory] = useState([]);
      const [monthlyBudget, setMonthlyBudget] = useState(0);
      const [budgetId, setbudgetId] = useState(0)

      //obtain the budget_id that is currently in use 
      const checkBudget = async () => {

        let { data: budget } = await supabase
            .from('budget')
            .select('budget_id')
            .eq('in_use', true);

        const budget_id = budget[0]?.budget_id
        // console.log(budget_id)
        setbudgetId(budget_id);

          if (budget_id == undefined) {
            setBoolean(false);
          }
          console.log(boolean)
      }

      useEffect(() => {
        checkBudget();
      }, [])

    

    const fetchBudgetDetail = async () => {

      let {data: budget} = await supabase.from('budget').select('income, spending').eq('in_use', true).eq('budget_id', budgetId)

      const income = parseInt(budget[0]?.income);
      const spend = budget[0]?.spending;
      const budgetAmount = income * spend;

      console.log(income)
      console.log(spend)
      console.log(budgetAmount)

      setMonthlyBudget(budgetAmount);
      
    }

     useEffect(() => {
        fetchBudgetDetail();
      }, []);
    
    const fetchCategoryDetail = async () => {

      let {data: categoryData} = await supabase.from('categories').select('category, spending, color').eq('in_use', true)
      console.log(category)
      setCategory(categoryData);

    }

    useEffect(() => {
      fetchCategoryDetail();
    }, []);


    const BudgetBox = () => {
      return (
        <View style={{ marginTop: -15, flex: 1}}>
          <Text style={{fontFamily: 'Poppins-Regular' , left: 280, marginBottom:10}}> Edit</Text> 
      <View  style={{backgroundColor: '#000E90', borderRadius: 18, paddingHorizontal: 30, paddingTop: 15, paddingBottom:8}}>
        {category.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} >
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color, marginRight: 20 }} />
              <Text style={{ fontFamily: 'Poppins-Medium', width: 120, color:'#fff'}}>{item.category}</Text>
              <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize:18, width: 85, color:'#fff'}}>${(monthlyBudget * item.spending).toFixed(0)}</Text>
              <Text style={{ fontFamily: 'Poppins-Medium', width: 30, color:'#fff'}}>{`${(item.spending * 100).toFixed(0)}%`}</Text>
          </View>
        ))}
   
        {/* <Text onPress={()=> {router.push("../(budgetTabs)/BudgetBoard")}} >
                test
            </Text> */}
     </View>
     </View>
      );
    }

    //checking if there is budget
   if (boolean) {
    //The page for when there is a budget 
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" , backgroundColor: "#fff"}}>
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
        <Text style={{fontFamily:'Poppins-Regular', color:'#2C2646', marginTop: 20}}>Monthly Budget</Text>
        <Text style={{fontFamily:'Poppins-SemiBold', color:'#2C2646', fontSize:48, marginTop: 0}}>${monthlyBudget}</Text>
        <BudgetBox />
        </View>
        </ScrollView>
      </SafeAreaView>
    );
    } else {
    //The page for when there is  no budget
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" , backgroundColor: "#fff"}}>
            <Design />
            <CreateBudgetButton /> 

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
        left: '15%', 
        right: '15%', 
        top: "80.72%", 
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