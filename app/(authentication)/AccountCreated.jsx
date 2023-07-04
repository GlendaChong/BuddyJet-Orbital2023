import { React } from "react"; 
import { StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'expo-router';

function AccountCreated() {
    const router = useRouter();
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.header}>Account Created!</Text>
            <Text style={styles.descriptionText}>Your account has been created successfully. </Text>
            <FontAwesomeIcon icon={faCheckCircle} size={100} color='green' />
            <Button 
                style={styles.loginButton} 
                labelStyle={styles.loginText}
                onPress={() => router.push('./Login')}
            >
                Login Now
            </Button>
        </SafeAreaView>
    ); 
}

const styles = StyleSheet.create({
    header: {
        fontFamily: 'Poppins-SemiBold', 
        fontWeight: 600, 
        fontSize: 33,
        lineHeight: 50, 
        color: '#100D40', 
        justifyContent: 'center', 
        alignItems: 'center', 
    }, 
    descriptionText: {
        fontFamily: 'Poppins-Regular', 
        fontWeight: 400, 
        fontSize: 18, 
        lineHeight: 24, 
        color: '#100D40',
        textAlign: 'center', 
        opacity: 0.65, 
        marginBottom: 120, 
    }, 
    loginButton: {
        backgroundColor: '#3D70FF',
        borderRadius: 40, 
        width: 327, 
        height: 56, 
        marginTop: 120, 
        justifyContent: 'center', 
    }, 
    loginText: {
        color: 'white', 
        fontFamily: 'Poppins-SemiBold', 
        fontWeight: 600, 
        fontSize: 18, 
        lineHeight: 35,  
        textAlign: 'center', 
    },
}); 

export default AccountCreated; 