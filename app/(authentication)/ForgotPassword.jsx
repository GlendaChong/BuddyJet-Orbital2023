import { useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import TextFieldInput from "../components/TextFieldInput"
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const router = useRouter(); 

    // Supabase to send an email with OTP
    const handleSendOTP = async () => {
        setErrMsg('');
        try {
            if (email === '' ) {
                  setErrMsg("Email cannot be empty");
                  return;
            } 

            setLoading(true);
            
            try {
                // Check if the email exists in the backend
                const { data, error } = await supabase
                    .from("userEmail")
                    .select("email")
                    .eq('email', email)
                    .single(); 
                
                if (data == null) {
                    // User email not found in the backend, get user to create new account instead
                    setErrMsg("User with this email does not exist. Please create a new account instead.");
                    return;
                }

            } catch (error) {
                console.error("error with checking if user is registered"); 
                return; 
            }
    
            // Only allow signing in with OTP if user is registered previously
            const { error } = await supabase.auth.signInWithOtp({ email: email });
            setLoading(false);
            setIsEmailSent(true);

        } catch (error) {
            setErrMsg("Error sending email: " + error);
        }
    };

    // Verify OTP to confirm user account
    const handleVerifyOTP = async () => {
        setErrMsg('');

        try {
            setLoading(true);
            // Use the token as the OTP for password reset
            const { error } = await supabase.auth.verifyOtp({ email: email, token: otp, type: 'email' });
            setLoading(false);

            if (!error) {
                // OTP verification successful
                // Show the alert message for password reset
                Alert.alert(
                    "OTP Verification Successful",
                    "Please proceed to change your password at the Profile Tab.",
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                );
            }
    
        } catch (error) {
            setErrMsg("Error logging in with OTP: " + error);
        }
    };

        
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior="padding"
                keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })} // Adjust this value as per your requirement
            >
            {!isEmailSent ? (
                <ScrollView>
                    <TouchableOpacity style={{ marginLeft: 30, marginTop: 20 }} onPress={() => { router.back() }}>
                        <FontAwesomeIcon
                        icon={faChevronLeft}
                        size={20}
                        />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.welcomeText}>Forgot Password</Text>
                        <Image style={styles.image} source={require('../../assets/changePassword.jpg')} />
                        <Text style={styles.descriptionText}>Enter your registered email below to receive an OTP to login</Text>
                    </View>
                    <TextFieldInput label='Email' value={email} onChangeText={setEmail} />
                    {errMsg !== " " && <Text style={styles.errorText}>{errMsg}</Text>}
                    <Button
                        style={styles.resetButton}
                        labelStyle={styles.resetText}
                        onPress={handleSendOTP}
                    >
                        Reset Password
                    </Button>
                    {loading && <ActivityIndicator />}
                </ScrollView>
            )  : (
                <ScrollView>
                    <TouchableOpacity style={{ marginLeft: 30, marginTop: 20 }} onPress={() => { router.back() }}>
                        <FontAwesomeIcon
                        icon={faChevronLeft}
                        size={20}
                        />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.welcomeText}>Verify Your OTP</Text>
                        <Image style={styles.image} source={require('../../assets/changePassword.jpg')} />
                        <Text style={styles.descriptionText}>
                            A 6-digit code has been set to your email: {email}. 
                            Once signed in, please proceed to change your password. 
                        </Text>
                    </View>
                    <TextFieldInput label='OTP' value={otp} onChangeText={setOTP} />
                    {errMsg !== "" && <Text style={styles.errorText}>{errMsg}</Text>}
                    <Button
                        style={styles.resetButton}
                        labelStyle={styles.resetText}
                        onPress={handleVerifyOTP}
                    >
                        Reset
                    </Button>
                    {loading && <ActivityIndicator />}
                </ScrollView>      
            )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    welcomeText: {
        fontFamily: 'Poppins-SemiBold',
        fontWeight: 600,
        fontSize: 30,
        lineHeight: 60,
        color: '#100D40',
        alignContent: 'center',
        marginTop: 30,
    },
    BackButton: {
        position: 'absolute',
        marginTop: 7,
        left: 30
    },
    BackText: {
        fontFamily: 'Poppins-Regular',
        fontWeight: 600,
        fontSize: 15,
        position: 'absolute',
        marginTop: 7,
        left: 20,
        color: '#fff',
        opacity: 100,
    },
    descriptionText: {
        fontFamily: 'Poppins-Regular',
        fontWeight: 400,
        fontSize: 14,
        lineHeight: 24,
        color: '#100D40',
        marginTop: 40,
        paddingHorizontal: 40,
        textAlign: 'center'

    },
    passwordText: {
        textAlign: 'right',
        right: 35,
        marginTop: 10,
    },
    resetButton: {
        backgroundColor: "#3D70FF",
        borderRadius: 40,
        marginHorizontal: 30,
        marginTop: 30,
        marginBottom: 10,
     },
    resetText: {
        color: "white",
        fontFamily: "Poppins-SemiBold",
        fontWeight: 600,
        fontSize: 18,
        lineHeight: 40,
    },
    image: {
        width: 300,
        height: 230,
        alignSelf: "center",
    },
    errorText: {
        paddingVertical: 10,
        color: 'red', 
        paddingHorizontal: 30, 
    }
});


export default ForgotPassword; 