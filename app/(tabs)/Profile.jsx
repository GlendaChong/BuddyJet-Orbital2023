import { Text} from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

function Profile() {
    const handleLogOut = async () => {
        await supabase.auth.signOut(); 
    }
    
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>This is the profile page. Work in progress!</Text>
            <Button onPress={handleLogOut}>Logout</Button>
        </SafeAreaView>
    ); 
}

export default Profile; 