import { Text, TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";

// Method to display the input fields
export default function TextFieldInput({ label, value, onChangeText}) {
    return (
        <>
            <Text style={styles.textfieldName}>{label}</Text>
            <TextInput style={styles.textfieldInput}
                autoCapitalize='none'
                textContentType="none"
                secureTextEntry={label == ('Password') || (label =='Confirm Password')}
                value={value}
                onChangeText={onChangeText}
        />
        </>
    );
}

const styles = StyleSheet.create({
    textfieldName: {
        left: 30,
        fontFamily: 'Poppins-Medium',
        fontWeight: 400, 
        fontSize: 17, 
        lineHeight: 26, 
        color: '#100D40', 
        opacity: 0.65,    
        marginTop: 40,      
    },
    textfieldInput: {
        width: 327, 
        left: 30,
        fontFamily: 'Poppins-Medium',
        color: 'black',
        borderRadius: 4, 
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 3,
        marginTop: 10, 
    },  
}); 
