import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import { Button} from 'react-native-paper';
import { useRouter } from 'expo-router';


export default function Budget() {
    const router = useRouter();

    const CreateBudgetButton = () => {
        return (
          <Button
          mode="contained" 
          style={styles.createBudgetButton}
          labelStyle={styles.createBudgetText}
          onPress={() => router.push('../(budgetTabs)/CreateBudget')}
          >
            Create a budget
          </Button>
        ); 
      };

      const Design = () => {
        return (
          <View>
            <Image style={styles.image} source={require('../../assets/budget.jpeg')} />
            <Text style={styles.mainText}>No Budget</Text>
            <Text style={styles.descriptionText}>You have not created a budget</Text>
          </View>
        ); 
      }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" , backgroundColor: "#fff"}}>
            <Design />
            <CreateBudgetButton /> 
        </SafeAreaView>
    ); 
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