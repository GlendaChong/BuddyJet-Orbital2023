import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { createContext, useContext, useEffect, useState } from 'react';

function Expenses() {

  // //OG
  const handleSubmit1 = async () => {

    // test
  let { data: profiles, errors } = await supabase
      .from('profiles')
      .select('id')
    
      console.log(profiles)

      // const { data: { user } } = await supabase.auth.admin.getUserById("f2a20032-2efa-4146-b7fd-1c87b008daa0")

      // console.log(user)
   

      // const { session, user } = data

     
  }


  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>This is the home page. Work in progress!</Text>
      <Text onPress={()=> {handleSubmit1()}} >
                test
            </Text>
    </SafeAreaView>
  );
}


export default Expenses; 