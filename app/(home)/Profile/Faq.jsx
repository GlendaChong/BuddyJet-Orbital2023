import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

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
                {/* <View style={styles.container}> */}
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
                {/* </View> */}
            </ScrollView>
        </SafeAreaView>
    );
}

export default Faq;

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
        fontSize: 18,
        color: "#0A84FF",
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
    },
});

// FAQ data
const faqData = [
    {
        question: "How to edit profile?",
        answer: "Navigate to the profile tab, tap on the field which you wish to edit and click on the update button",
    },
    {
        question: "Question 2",
        answer: "Answer 2",
    },
    {
        question: "Question 2",
        answer: "Answer 2",
    },
    // Can add more Faq
];
