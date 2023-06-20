import { Text } from "react-native"; 
import { SafeAreaView } from "react-native-safe-area-context";
import TextFieldInput from "./TextFieldInput";
import BackButton from "../components/BackButton";
import { ScrollView } from "react-native-gesture-handler";
import { supabase } from "../../lib/supabase";

function Dashboard() {
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
            <ScrollView>
                <BackButton />
                <Text style={{fontFamily:'Poppins-SemiBold', fontSize:35, marginTop: 40, marginHorizontal: 30}}>Edit</Text>
            </ScrollView>
        </SafeAreaView>
    ); 
}

export default Dashboard; 