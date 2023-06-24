import { Text, StyleSheet, View } from "react-native";
import { Button } from 'react-native-paper';
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from 'expo-router';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
// import TextFieldInput from "../(authentication)/TextFieldInput";
import TextFieldInput from "./TextFieldInput";
import { ScrollView } from "react-native-gesture-handler";
import BackButton from "../../components/BackButton";
import { supabase } from "../../../lib/supabase";


function CreateBudget() {
  const router = useRouter();
  const [loading, setLoading] = useState(true)
  const [income, setIncome] = useState('');
  const [errMsg, setErrMsg] = useState('');

  //handle the submission for budget 1
  const handleSubmit1 = async () => {

    //obtain the user_id from the profile database 
    let { data: profiles } = await supabase
      .from('profiles')
      .select('id')

    const selectedID = profiles[0]?.id;

    if (income == '') {
      setErrMsg("Income cannot be empty")
      return;
    }

    setLoading(true)

    const updates = {
      income,
      user_id: selectedID,
    }

    // insert the data into the budget table 
    await supabase.from('budget').insert([updates]);

    //obtain the budget_id that is currently in use 
    let { data: budget } = await supabase
      .from('budget')
      .select('budget_id')
      .eq('in_use', true)

    const budgetID = budget[0]?.budget_id
    console.log(budget)

    // insert data into category table
    const { data, error } =
      await supabase.from('categories').insert([
        { user_id: selectedID, budget_id: budgetID, category: 'Food', spending: 0.25, color: '#BF5AF2' }
        , { user_id: selectedID, budget_id: budgetID, category: 'Transport', spending: 0.15, color: '#0A84FF' }
        , { user_id: selectedID, budget_id: budgetID, category: 'Recreation', spending: 0.3, color: '#F46040' }
        , { user_id: selectedID, budget_id: budgetID, category: 'Bills', spending: 0.10, color: '#32D74B' }
        , { user_id: selectedID, budget_id: budgetID, category: 'Saving', spending: 0.20, color: '#64D2FF' }
      ]);

    if (error) {
      alert(error.message)

    }
    setLoading(false)

  }


  const MakeBudgetButton = () => {
    return (

      <View>
        <Text style={{ color: '#fff', opacity: 0.1, marginTop: -75 }}> anchor </Text>
        <View style={{ bottom: 140, paddingHorizontal: 28, paddingVertical: 18 }}>
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
          }
          }
        >
          Make your own budget
        </Button>
      </View>

    );
  };

  const Budget1Desc = () => {
    return (
      <View>
        <Text style={{ color: '#fff', opacity: 0.1, marginTop: 15 }}> anchor </Text>
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ bottom: 240, left: 250 }}
          size={25}
        />
        {/* <Text onPress={() => { router.back(), handleSubmit1() }} style={{ bottom: 275, fontSize: 30, left: 230, opacity: 0.1, color: '#F3F6FA' }} >
          back
        </Text> */}

        <Text onPress={() => { router.push('/'), handleSubmit1() }} style={{ bottom: 275, fontSize: 30, left: 230, opacity: 0.1, color: '#F3F6FA' }} >
          back
        </Text>


        <FontAwesomeIcon
          icon={faCircle}
          style={{ color: '#64D2FF', bottom: 305, left: 28 }}
          size={15}
        />

        <FontAwesomeIcon
          icon={faCircle}
          style={{ color: '#BF5AF2', bottom: 280, left: 28 }}
          size={15}
        />
        <FontAwesomeIcon
          icon={faCircle}
          style={{ color: '#0A84FF', bottom: 250, left: 29 }}
          size={15}
        />
        <FontAwesomeIcon
          icon={faCircle}
          style={{ color: '#F46040', bottom: 220, left: 29 }}
          size={15}
        />
        <FontAwesomeIcon
          icon={faCircle}
          style={{ color: '#32D74B', bottom: 188, left: 29 }}
          size={15}
        />
        <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#2C2646', fontSize: 15, bottom: 384, left: 70 }}>Saving: 20% </Text>
        <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#2C2646', fontSize: 15, bottom: 364, left: 70 }}>Food: 25% </Text>
        <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#2C2646', fontSize: 15, bottom: 340, left: 70 }}>Transport: 15% </Text>
        <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#2C2646', fontSize: 15, bottom: 315, left: 70 }}>Recreation: 30% </Text>
        <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#2C2646', fontSize: 15, bottom: 288, left: 70 }}>Bills: 10% </Text>
      </View>
    );
  };

  const SampleBudget1 = () => {

    return (
      <View style={{ padding: 35 }}>
        <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#2C2646', fontSize: 18 }}>Sample Budget 1</Text>
        <Text style={{ fontFamily: 'Poppins-Regular', color: '#2C2646', fontSize: 13, top: 10 }}>Basic need budget</Text>
        <View style={styles.roundedRect} />
        <Budget1Desc />
        {/* {errMsg !== "" && <Text>{errMsg}</Text>} */}

      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView>
        <BackButton />
        <Text style={styles.CreateText}>Create</Text>
        <Text style={styles.DescriptionText}>A budget</Text>
        <TextFieldInput label='Income' value={income} onChangeText={setIncome} />
        <SampleBudget1 />
        <View style={{ marginTop: -45, marginBottom: -90 }}>
          <MakeBudgetButton />

        </View>
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