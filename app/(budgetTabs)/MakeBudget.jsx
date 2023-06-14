import { Text, StyleSheet } from "react-native"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import TextFieldInput from "./TextFieldInput";
import { useState } from "react";



function MakeBudget() {
    const router = useRouter();
    const [income, setIncome] = useState(''); 

    return (
        <SafeAreaView style={{ flex:1, backgroundColor: "#fff"}}>
            <ScrollView>
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    style={styles.BackButton}
                    size={20}
                 />
                <Text onPress={()=> {router.back();}} style={styles.CreateText} >
                    Create
                </Text>
                <Text style={styles.MakeText}>Make</Text>
                <Text style={styles.DescriptionText}>Your own budget</Text>
                <TextFieldInput label='Income' value={income} onChangeText={setIncome} />
            
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
        fontFamily: 'Poppins-Regular', 
        fontWeight: 600, 
        fontSize: 15, 
        position: 'absolute', 
        marginTop: 7, 
        left: 20,
        color: '#fff', 
        opacity: 0.1, 
      }, 
      MakeText: {
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
        fontSize: 16, 
        lineHeight: 52, 
        width: 289,
        marginTop: 85, 
        left: 30,
        alignContent: 'center',
        color: '#100D40', 
    }, 
    
    },
);  
export default MakeBudget; 