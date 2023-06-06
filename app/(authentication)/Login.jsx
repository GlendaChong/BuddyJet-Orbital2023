import { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import TextFieldInput from "./TextFieldInput";

export default function Login() {
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
        <SafeAreaView style={{ flex: 1}}>
            <Text style={styles.welcomeText}>Welcome!</Text>
            <Text style={styles.descriptionText}>Please sign in to continue</Text>
            <TextFieldInput label='Email' value={email} onChangeText={setEmail} />
            <TextFieldInput label='Password' value={password} onChangeText={setPassword} />
            <Text style={styles.passwordText}>Forgot Password?</Text>
            <Button
                style={styles.loginButton}
                labelStyle={styles.loginText}
                onPress={handleSubmit}
            >
                Login
            </Button>
            
            {errMsg !== "" && <Text>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
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
        marginTop: 40, 
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
})