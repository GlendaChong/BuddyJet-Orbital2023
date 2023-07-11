import { useState } from "react";
import React from 'react';
import { StyleSheet, View, Image } from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import TextFieldInput from "../../components/TextFieldInput";
import { ScrollView } from "react-native-gesture-handler";
import BackButton from '../../components/BackButton'
import { useRouter } from "expo-router";

function ChangePassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const handleSubmit = async () => {
        setErrMsg('');
        if (email === '') {
            setErrMsg("Email cannot be empty");
            return;
        }
        if (oldPassword === '') {
            setErrMsg("Old Password cannot be empty");
            return;
        }
        if (newPassword === '') {
            setErrMsg("New Password cannot be empty");
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrMsg("Passwords do not match");
            return;
        }
        setLoading(true);
        const { errors } = await supabase.auth.signInWithPassword({ email, password: oldPassword });

        if (errors) {
            setLoading(false);
            setErrMsg("Incorrect details");
            return;
        }

        const { error } = await supabase.auth.updateUser({ email, password: newPassword });
        setLoading(false);
        if (error) {
            setErrMsg("Incorrect details");
            return;
        }
        await supabase.auth.signOut();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView>
                <BackButton />
                <Text style={styles.welcomeText}>Change Password</Text>
                <Image style={{ marginTop: 40, left: 90 }} source={require('../../../assets/Forgot_password.jpg')} />
                <TextFieldInput label='Email' value={email} onChangeText={setEmail} />
                <TextFieldInput label='Old Password' value={oldPassword} onChangeText={setOldPassword} />
                <TextFieldInput label='New Password' value={newPassword} onChangeText={setNewPassword} />
                <TextFieldInput label='Confirm New Password' value={confirmPassword} onChangeText={setConfirmPassword} />
                <Button
                    style={styles.loginButton}
                    labelStyle={styles.loginText}
                    onPress={handleSubmit}
                >
                    Change
                </Button>
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    {errMsg !== "" && <Text>{errMsg}</Text>}
                    {loading && <ActivityIndicator />}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    welcomeText: {
        left: 55,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: 600,
        fontSize: 30,
        lineHeight: 60,
        color: '#100D40',
        alignContent: 'center',
        marginTop: 60,
    },
    descriptionText: {
        left: 30,
        fontFamily: 'Poppins-Regular',
        fontWeight: 400,
        fontSize: 19,
        lineHeight: 24,
        color: '#100D40',
        opacity: 0.65,
        marginBottom: 60,
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
});

export default ChangePassword; 
