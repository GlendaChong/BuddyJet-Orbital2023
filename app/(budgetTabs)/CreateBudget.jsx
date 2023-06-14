import { Text, StyleSheet} from "react-native";
import { Button } from 'react-native-paper';
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
// import TextFieldInput from "../(authentication)/TextFieldInput";
import TextFieldInput from "./TextFieldInput";
import { ScrollView } from "react-native-gesture-handler";



function CreateBudget() {
    const router = useRouter();
    const [income, setIncome] = useState(''); 

    const handleSubmit = async () => {
        if (income == '') {
            setErrMsg("Income cannot be empty")
            return;
        }
    }

    const MakeBudgetButton = () => {
        return (
          <Button
          mode="contained" 
          style={styles.MakeBudgetButton}
          labelStyle={styles.MakeBudgetText}
          onPress={() => router.push('./MakeBudget')}
          >
            Make your own budget
          </Button>
        ); 
      };
    
  return (
    <SafeAreaView style={{ flex:1, backgroundColor: '#fff' }}>
      <ScrollView>
      <FontAwesomeIcon
        icon={faChevronLeft}
        onPress={() => {
          router.back();
        }}
        style={styles.BackButton}
        size={20}
      />
      <Text
        style={styles.BudgetText}
        onPress={() => {
          router.back();
        }}
      >
        Budget
      </Text>
      <Text style={styles.CreateText}>Create</Text>
      <Text style={styles.DescriptionText}>A budget</Text>
      <TextFieldInput label='Income' value={income} onChangeText={setIncome} />
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

      BackButton: {
        position: 'absolute', 
        marginTop: 7,
        left: 30
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

      BudgetText: {
        fontFamily: 'Poppins-Regular', 
        fontWeight: 600, 
        fontSize: 15, 
        position: 'absolute', 
        marginTop: 7, 
        // left: 55,
        left: 20,
        color: '#fff', 
        opacity: 0.1, 
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

      MakeBudgetButton: {
        backgroundColor: '#3D70FF',
        borderRadius: 40, 
        width: 327, 
        height: 56, 
        left: 30,
        marginTop: 800, 
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