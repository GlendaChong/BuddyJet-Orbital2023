import { useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import TextFieldInput from "./TextFieldInput";
import { ScrollView } from "react-native-gesture-handler";
import BackButton from "../components/BackButton";
import { useRouter } from 'expo-router';


function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const handleSubmit = async () => {
        setErrMsg('');
        if (email == '') {
            setErrMsg("Email cannot be empty")
            return;
        }
        if (password == '') {
            setErrMsg("Password cannot be empty")
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
            setErrMsg(error.message);
            return;
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior="padding"
                keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })} // Adjust this value as per your requirement
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <BackButton />
                    <Text style={styles.welcomeText}>Welcome!</Text>
                    <Text style={styles.descriptionText}>Please sign in to continue</Text>
                    <TextFieldInput label='Email' value={email} onChangeText={setEmail} />
                    <TextFieldInput label='Password' value={password} onChangeText={setPassword} />
                    {errMsg !== "" && <Text style={styles.errorText}>{errMsg}</Text>}
                    <Text onPress={() => { router.push('./ForgotPassword') }} style={styles.passwordText}>Forgot Password?</Text>

                    <Button
                        style={styles.loginButton}
                        labelStyle={styles.loginText}
                        onPress={handleSubmit}
                    >
                        Login
                    </Button>

                    {loading && <ActivityIndicator />}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    welcomeText: {
        left: 30,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: 600,
        fontSize: 45,
        lineHeight: 68,
        color: '#100D40',
        alignContent: 'center',
        marginTop: 80,
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
        marginHorizontal: 30,
        height: 56,
        marginTop: 50,
    },
    loginText: {
        color: 'white',
        fontFamily: 'Poppins-SemiBold',
        fontWeight: 600,
        fontSize: 18,
        paddingVertical: 12,
    },
    errorText: {
        left: 30,
        paddingVertical: 10,
        color: 'red'
    }
})

export default Login; 