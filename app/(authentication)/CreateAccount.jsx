import { useState } from "react";
import { StyleSheet } from "react-native"; 
import { supabase } from "../../lib/supabase";
import { ScrollView } from "react-native-gesture-handler";
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import TextFieldInput from "./TextFieldInput";

export default function CreateAccount() {
    const [name, setName] = useState(''); 
    const [dateOfBirth, setDateOfBirth] = useState(''); 
    const [phoneNumber, setPhoneNumber] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const dateFormat = /^(\d{2}-)(\d{2}-)(\d{4})$/;

    const handleSubmit = async () => {
        if (name == '') {
            setErrMsg("Name cannot be empty")
            return;
        }

        if (dateOfBirth == '') {
            setErrMsg("Date of Birth cannot be empty")
            return;
        } else if (!dateOfBirth.match(dateFormat)) {
            setErrMsg("Date of Birth must be in DD-MM-YYYY format")
            return; 
        }

        if (phoneNumber == '') {
            setErrMsg("Phone number cannot be empty")
            return;
        } else if (isNaN(parseInt(phoneNumber))) {
            setErrMsg("Phone number contains illegal characters")
            return; 
        }

        if (email == '') {
            setErrMsg("Email cannot be empty")
            return;
        }
        if (password == '' || confirmPassword == '') {
            setErrMsg("Password cannot be empty")
            return;
        }
        if (confirmPassword != password) {
            setErrMsg('Password and confirmed password does not match')
        }
      
        setLoading(true);
        const { error } = await supabase.auth.signUp({ 
           email, password, options: { name, dateOfBirth, phoneNumber, confirmPassword }
        });
        setLoading(false);
        if (error) {
            setErrMsg(error.message);
            return;
        }
    }

    return (
        <SafeAreaView style={{ flex:1 }}>
            <ScrollView>
                <Text style={styles.helloText}>Hello!</Text>
                <Text style={styles.descriptionText}>Create a new account</Text>
                <TextFieldInput label='Name' value={name} onChangeText={setName} />
                <TextFieldInput label='Date of Birth (DD-MM-YYYY)' value={dateOfBirth} placeholder='DD/MM/YYYYY' onChangeText={setDateOfBirth} />
                <TextFieldInput label='Phone Number' value={phoneNumber} onChangeText={setPhoneNumber} />
                <TextFieldInput label='Email' value={email} onChangeText={setEmail} />
                <TextFieldInput label='Password' value={password} onChangeText={setPassword} />
                <TextFieldInput label='Confirm Password' value={confirmPassword} onChangeText={setConfirmPassword} />
                <Button 
                    style={styles.signUpButton} 
                    labelStyle={styles.signUpText} 
                    onPress={handleSubmit}
                >
                    Sign Up
                </Button>
                {errMsg !== "" && <Text>{errMsg}</Text>}
                {loading && <ActivityIndicator />}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    helloText: {
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
    }, 
    signUpButton: {
        backgroundColor: '#3D70FF',
        borderRadius: 40, 
        width: 327, 
        height: 56, 
        left: 30,
        marginTop: 50, 
    },
    signUpText: {
        color: 'white', 
        fontFamily: 'Poppins-SemiBold', 
        fontWeight: 600, 
        fontSize: 18, 
        lineHeight: 35,  
        textAlign: 'center', 
    }, 
 }); 