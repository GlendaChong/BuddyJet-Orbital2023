import { useState } from "react";
import { StyleSheet, Image, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import { Text, Button } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import BackButton from '../../components/BackButton'
import TextFieldInput from "../../components/TextFieldInput";


function ChangePassword() {
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
            setErrMsg("Incorrect old password");
            return;
        }

        const { error } = await supabase.auth.updateUser({ email, password: newPassword });
        setLoading(false);
        if (error) {
            setErrMsg("Invalid new password");
            return;
        }

        await supabase.auth.signOut();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView>
                    <BackButton />
                    <Text style={styles.welcomeText}>Change Password</Text>
                    <Image style={{ height: 200, width: 300, alignSelf: 'center', marginTop: 20 }} source={require('../../../assets/Forgot_password.jpg')} />
                    <TextFieldInput label='Email' value={email} onChangeText={setEmail} />
                    <TextFieldInput label='Old Password' value={oldPassword} onChangeText={setOldPassword} />
                    <TextFieldInput label='New Password' value={newPassword} onChangeText={setNewPassword} />
                    <TextFieldInput label='Confirm New Password' value={confirmPassword} onChangeText={setConfirmPassword} />
                    {errMsg !== "" && <Text style={styles.errorText}>{errMsg}</Text>}
                    {loading && <ActivityIndicator />}
                    <Button
                        style={styles.changeButton}
                        labelStyle={styles.changeText}
                        onPress={handleSubmit}
                    >
                        Change
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    welcomeText: {
        alignSelf: "center",
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
    changeButton: {
        backgroundColor: "#3D70FF",
        borderRadius: 40,
        marginHorizontal: 30,
        marginTop: 30,
        marginBottom: 10,
        width: 330,
      },
    changeText: {
        color: "white",
        fontFamily: "Poppins-SemiBold",
        fontWeight: 600,
        fontSize: 18,
        lineHeight: 40,
    },
    errorText: {
        left: 30,  
        paddingVertical: 10, 
        color: 'red'
    }
});

export default ChangePassword; 
