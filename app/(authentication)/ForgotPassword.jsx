import { useState, useEffect } from "react";
import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import TextFieldInput from "../components/TextFieldInput"
import { ScrollView } from "react-native-gesture-handler";
import BackButton from '../components/BackButton'
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import * as Linking from 'expo-linking'

function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');;
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    let redirectURL = Linking.createURL('ResetPassword')
    console.log(redirectURL)

    const handleSubmit = async () => {
        router.push('./ResetPassword')

        setErrMsg('');
        if (email === '') {
            setErrMsg("Email cannot be empty");
            return;
        }
        setLoading(true);
        // const { error } = await supabase.auth.resetPasswordForEmail(email)

        /**
         * Step 1: Send the user an email to get a password reset token.
         * This email contains a link which sends the user back to your application.
         */
        const { data, error } = await supabase.auth
            .resetPasswordForEmail(email)


        setLoading(false);

        if (error) {
            setErrMsg(error.message);
            return;
        }

    };

    /**
      * Step 2: Once the user is redirected back to your application,
      * ask the user to reset their password.
      */
    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event == "PASSWORD_RECOVERY") {
                const newPassword = prompt("What would you like your new password to be?");
                const { data, error } = await supabase.auth
                    .updateUser({ password: newPassword })

                if (data) alert("Password updated successfully!")
                if (error) alert("There was an error updating your password.")
            }
        })
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <TouchableOpacity style={{ marginLeft: 30, marginTop: 20 }} onPress={() => { router.back() }}><FontAwesomeIcon
                    icon={faChevronLeft}
                    size={20}
                /></TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.welcomeText}>Forgot Password</Text>
                    <Image style={{ marginTop: 60 }} source={require('../../assets/changePassword.jpg')} />
                    <Text style={styles.descriptionText}>Enter your registered email below to receive password reset instructions</Text>
                </View>
                <TextFieldInput label='Email' value={email} onChangeText={setEmail} />
                <Button
                    style={styles.loginButton}
                    labelStyle={styles.loginText}
                    onPress={handleSubmit}
                >
                    Reset Password
                </Button>
                <View style={{ alignItems: 'center', marginTop: 15, marginHorizontal: 30 }}>
                    {errMsg !== " " && <Text>{errMsg}</Text>}
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
        lineHeight: 35,
    },
}

export default ForgotPassword; 