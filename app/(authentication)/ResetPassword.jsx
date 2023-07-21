import { useState } from "react";
import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
// import { supabase } from "../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import TextFieldInput from "../components/TextFieldInput"
import { ScrollView } from "react-native-gesture-handler";
import BackButton from '../components/BackButton'
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import * as Linking from 'expo-linking'


function ResetPassword() {
    // console.log(window.location.pathname);
    // Linking.createURL();
    const router = useRouter();
    const { email } = useLocalSearchParams(); 
    const [otp, setOTP] = useState(''); 
    // const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');


    const handleSubmit = async () => {
        setErrMsg('');
        setLoading(true);
        // const { errors } = await supabase.auth.signInWithPassword({ email, password: oldPassword });

        // if (errors) {
        //     setLoading(false);
        //     setErrMsg("Incorrect details");
        //     return;
        // }

        // const { error } = await supabase.auth.updateUser({ email, password: newPassword });
        // setLoading(false);
        // if (error) {
        //     setErrMsg("Incorrect details");
        //     return;
        // }
        console.log(otp); 
        const session = await supabase.auth.verifyOtp({
            email: email,
            token: otp, 
            type: 'signup'
        }); 


        // console.log(error); 
        console.log(session); 
        if (session) {
            router.push("../(home)/Expenses");
        }
        
        // if (error) {
        //     return {
        //         success: false,
        //         error,
        //     };
        // }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <TouchableOpacity style={{ marginLeft: 30, marginTop: 20 }} onPress={() => { router.back() }}><FontAwesomeIcon
                    icon={faChevronLeft}
                    size={20}
                /></TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.welcomeText}>Verify Your OTP</Text>
                    <Image style={styles.image} source={require('../../assets/changePassword.jpg')} />
                    <Text style={styles.descriptionText}>
                        A 6-digit code has been set to your email: {email}. 
                        Once signed in, please proceed to change your password. 
                    </Text>
                </View>
                <TextFieldInput label='OTP' value={otp} onChangeText={setOTP} />
                {/* <TextFieldInput label='New Password' value={newPassword} onChangeText={setNewPassword} />
                <TextFieldInput label='Confirm New Password' value={confirmPassword} onChangeText={setConfirmPassword} /> */}
                <Button
                    style={styles.resetButton}
                    labelStyle={styles.resetText}
                    onPress={handleSubmit}
                >
                    Reset
                </Button>
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    {errMsg !== "" && <Text>{errMsg}</Text>}
                    {loading && <ActivityIndicator />}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = {
    welcomeText: {
        fontFamily: 'Poppins-SemiBold',
        fontWeight: 600,
        fontSize: 35,
        lineHeight: 60,
        color: '#100D40',
        alignContent: 'center',
        marginTop: 80,
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
        alignItems: 'center', 
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
}

export default ResetPassword; 
