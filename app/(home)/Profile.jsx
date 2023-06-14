import { Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { ScrollView } from "react-native-gesture-handler";

function Profile() {
    const handleLogOut = async () => {
        await supabase.auth.signOut(); 
    }
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F6FA"}}>
            <ScrollView>
                <Text>This is the profile page. Work in progress!</Text>
                <Button style={styles.LogoutButton} onPress={handleLogOut}>Logout</Button>
            </ScrollView>
        </SafeAreaView>
    ); 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },

    //   LogoutButton: {
    //     position: 'absolute', 
    //     marginTop: 700,
    //     alignContent: 'center',
    //   },
},
);   

export default Profile; 