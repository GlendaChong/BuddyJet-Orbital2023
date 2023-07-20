import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

// FAQ data
const faqData = [
    {
        question: "How do I edit my profile?",
        answer: "Navigate to the Profile tab. Tap on the field which you wish to edit and click on the update button. "
    },
    {
        question: "How do I add a new expense entry?",
        answer: "Navigate to the Expenses tab, tap on the plus button and fill up the required details in the appropriate format. "
    },
    {
        question: "I have just added in a new expense, but I do not see it in the Expenses Page. Why?",
        answer: "The default month for the Expenses Page is set to the current month. " + 
                "Ensure that you have navigated to the desired month and year using the Month Year Picker to view the newly added expense."
    },
    {
        question: "How do I create a budget?",
        answer: "Navigate to the Budget tab, select the month and year that you wish to create the budget for. " + 
                "Ensure that you fill in the fixed income and select a sample budget. "
    },
    {
        question: "Why can't I create a budget for past months?",
        answer: "This is because budgeting should be done before the month, instead of after the month. There is no need to create budgets for past months. "
    },
    {
        question: "iOS keeps suggesting passwords in the fields, but I would like to create my own password. What should I do?",
        answer: "If you are using an iOS device, select choose your own password in your keyboard view, and you can key in your own password. " + 
                "If you are using an iOS simulator, due to existing bug issues in React Native's Text Input component, " + 
                "you have to return back to the Profile Page first and try changing passwords again."
    },
    
];


function Faq() {
    const [answersVisible, setAnswersVisible] = useState([]);

    // Toggle the visibility of the answer when a question is clicked
    const toggleAnswerVisibility = (index) => {
        setAnswersVisible((prevState) => {
            const updatedAnswersVisible = [...prevState];
            updatedAnswersVisible[index] = !updatedAnswersVisible[index];
            return updatedAnswersVisible;
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F6FA" }}>
            <ScrollView>
                <BackButton />
                <Text style={styles.helloText}>FAQs</Text>
                {faqData.map((faq, index) => (
                    <View key={index} style={styles.questionContainer}>
                        <TouchableOpacity
                            onPress={() => toggleAnswerVisibility(index)}
                            style={styles.questionTextContainer}
                        >
                            <Text style={styles.questionText}>{faq.question}</Text>
                            <View style={styles.iconContainer}>
                                <FontAwesomeIcon
                                    icon={answersVisible[index] ? faAngleUp : faAngleDown}
                                    size={24}
                                    color="#0A84FF"
                                />
                            </View>
                        </TouchableOpacity>
                        {answersVisible[index] && (
                            <Text style={styles.answerText}>{faq.answer}</Text>
                        )}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    helloText: {
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        fontSize: 45,
        lineHeight: 68,
        color: '#100D40',
        marginTop: 40,
        marginBottom: 20,
        paddingHorizontal: 35,
    },
    questionContainer: {
        backgroundColor: 'white',
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden',
        marginHorizontal: 25
    },
    questionTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    questionText: {
        flex: 1,
        fontFamily: 'Poppins-Medium',
        fontSize: 17,
        color: "#0A84FF",
        paddingRight: 10
    },
    iconContainer: {
        padding: 10,
    },
    answerText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 15,
        color: "#100D40",
        paddingBottom: 20,
        paddingHorizontal: 20,
        lineHeight: 25,
    },
});


export default Faq;
