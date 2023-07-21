import { useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Alert } from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import TextFieldInput from "../components/TextFieldInput"
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);

    // Supabase to send an email with OTP
    const handleSendOTP = async () => {
        setErrMsg('');
        try {
            if (email === '' ) {
                  setErrMsg("Email cannot be empty");
                  return;
            } 
    
            setLoading(true);
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
                        <Text style={styles.descriptionText}>Enter your registered email below to receive password reset instructions</Text>
                    </View>
                    <TextFieldInput label='Email' value={email} onChangeText={setEmail} />
                    <Button
                        style={styles.resetButton}
                        labelStyle={styles.resetText}
                        onPress={handleSendOTP}
                    >
                        Reset Password
                    </Button>
                    <View style={{ alignItems: 'center', marginTop: 15, marginHorizontal: 30 }}>
                        {errMsg !== " " && <Text>{errMsg}</Text>}
                        {loading && <ActivityIndicator />}
                    </View>
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
                    <Button
                        style={styles.resetButton}
                        labelStyle={styles.resetText}
                        onPress={handleVerifyOTP}
                    >
                        Reset
                    </Button>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        {errMsg !== "" && <Text>{errMsg}</Text>}
                        {loading && <ActivityIndicator />}
                    </View>
                </ScrollView>      
            )}
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
    loginButton: {
        backgroundColor: '#3D70FF',
        borderRadius: 40,
        width: 327,
        height: 56,
        left: 30,
        marginTop: 50,
    },
    loginText: {
        color: 'white',
        fontFamily: 'Poppins-SemiBold',
        fontWeight: 600,
        fontSize: 18,
        lineHeight: 40,
    },
    image: {
        width: 300,
        height: 230,
        alignSelf: "center",
    },
});


export default ForgotPassword; 
