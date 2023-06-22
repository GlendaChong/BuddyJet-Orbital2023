import { View, Text, StyleSheet } from "react-native"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import TextFieldInput from "./TextFieldInput";
import { useState } from "react";
import Slider from '@react-native-community/slider';
import BackButton from "../../components/BackButton";
import { supabase } from "../../../lib/supabase";



function MakeBudget() {
    const router = useRouter();
    const [income, setIncome] = useState(''); 
    const [sliderValue, setSliderValue] = useState(15);
    var save = income * (sliderValue/100);
    var spend = income * (1 - (sliderValue/100));

    // const SaveSpendBox = () => {
    //     return (
    //         <View style={{flex: 1}}>
    //             <View style={styles.roundedRect} />
    //             <Text style={{color: '#2C2646', fontFamily:'Poppins-Regular', bottom: 45, left: 100}}> Save: </Text>
    //             <Text style={{color: '#2C2646', fontFamily:'Poppins-Regular', bottom: 30, left: 98}}> Spend: </Text>
    //             <Text style={{color: '#2C2646', fontFamily:'Poppins-SemiBold', fontSize: 20,  bottom: 88, left: 180}}> ${save.toFixed(2)} </Text>
    //             <Text style={{color: '#2C2646', fontFamily:'Poppins-SemiBold', fontSize: 20,  bottom: 81, left: 180}}> ${spend.toFixed(2)} </Text>
    //         </View>
    //     ); 
    //   };

    // const SaveSpendSlider = () => {
    //     return (
            
    //         <View style={{ flex: 1, padding:55, bottom: 100}}>
    //             <Slider
    //             maximumValue={100}
    //             minimumValue={0}
    //             minimumTrackTintColor="#007AFF"
    //             maximumTrackTintColor="#E4E4E6"
    //             step={1}
    //             value={sliderValue}
    //             onValueChange={(sliderValue) => setSliderValue(sliderValue)}
    //             />
    //             <Text style={{color: '#2C2646', fontFamily:'Poppins-Regular', left: -25, top: 0}}> Save </Text>
    //             <Text style={{color: '#2C2646', fontFamily:'Poppins-Medium', fontSize: 18, bottom: 19, left: 125 }}> {sliderValue}% </Text>
    //             <Text style={{color: '#2C2646', fontFamily:'Poppins-Regular',left: 250, bottom: 40}}> Spend </Text>
    //         </View>
            
            
    //     ); 
    //   };

      const buttonPress = () => {
        // setCreated(true); 
        router.push('../(home)/Budget');
      };

      const CreateBudgetButton = () => {
        return (

          <Button
          mode="contained" 
          style={styles.CreateBudgetButton}
          labelStyle={styles.CreateText}
          onPress={buttonPress}
          >
            Create
          </Button>
        ); 
      };


    return (
        <SafeAreaView style={{ flex:1, backgroundColor: "#fff"}}>
            <ScrollView>
                <BackButton />
                <Text style={styles.MakeText}>Make</Text>
                <Text style={styles.DescriptionText}>Your own budget</Text>
                <TextFieldInput label='Income' value={income} onChangeText={setIncome} />
                <Text style={{color: '#2C2646', fontFamily:'Poppins-SemiBold', fontSize: 18, marginTop: 35, paddingLeft: 30}}> Categories </Text>
                <CreateBudgetButton />
            </ScrollView>
        </SafeAreaView>
    ); 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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

    roundedRect: {
        width: 249,
        height: 92,
        backgroundColor: '#F3F6FA',
        borderRadius: 18,
        top: 30,
        left: 71,
      },

      CreateBudgetButton: {
        backgroundColor: '#3D70FF',
        borderRadius: 40, 
        width: 327, 
        height: 56, 
        left: 30,
        marginTop: 400, 
    },
      CreateText: {
        color: 'white', 
        fontFamily: 'Poppins-SemiBold', 
        fontWeight: 600, 
        fontSize: 18, 
        lineHeight: 35,  
        textAlign: 'center', 
    }, 
    
    },
);  
export default MakeBudget; 