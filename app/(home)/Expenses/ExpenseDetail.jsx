import { Text, StyleSheet, View, KeyboardAvoidingView, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, React, useEffect, useCallback } from "react";
import TextFieldInput from "../../components/TextFieldInput";
import BackButton from "../../components/BackButton";
import { ScrollView } from "react-native-gesture-handler";
import { supabase } from "../../../lib/supabase";
import { useRouter, useLocalSearchParams } from "expo-router";


function ExpenseDetail() {

    const { expensesId } = useLocalSearchParams();
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedPaymentMode, setSelectedPaymentMode] = useState('');
    const [pic, setPic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [refreshing, setRefreshing] = useState(false);


    const router = useRouter();

    // Fetch backend data
    const fetchExpense = useCallback(async () => {
        setRefreshing(true);
        try {
            const { data } = await supabase
                .from('expenses')
                .select()
                .eq('id', expensesId)
                .single();

            setDescription(data.description);
            setAmount(data.amount);
            setDate(data.date.split('-').reverse().join('/')); // Format the date from yyyy-mm-dd to dd/mm/yyyy
            setSelectedCategory(data.category);
            setSelectedPaymentMode(data.payment_mode);
            setPic(data.pic_url);

            setRefreshing(false);
        } catch (error) {
            console.error('Error fetching expense', error);
        }
    }, [pic, description, amount, date, selectedCategory, selectedPaymentMode])

    useEffect(() => {
        fetchExpense();
    }, [fetchExpense]);

    const handleEditExpense = async () => {
        router.push({
            pathname: "./EditExpenses",
            params: { expensesId },
        });
    }



    const Picture = () => {
        return (
            // <Text style={styles.subHeaderText}>Image</Text>
            <View>
                {pic !== null ? (
                    <View>
                        <Text style={styles.subHeaderText}>Image</Text>
                        <Image
                            source={{ uri: pic }}
                            style={{ width: 285, height: 200, borderRadius: 5, marginVertical: 15, marginLeft: 23 }}
                        />
                    </View>
                ) : (
                    <Image
                        source={{
                            url: "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg",
                        }}
                        style={{ width: 0, height: 0, borderRadius: 0 }}
                    />
                )}
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <BackButton />
                {refreshing && <ActivityIndicator />}
                <Text style={{ marginTop: 5, alignSelf: "flex-end", marginHorizontal: 45, fontFamily: "Poppins-Medium", fontSize: 25 }}
                    onPress={handleEditExpense}>Edit</Text>
                <Text style={styles.headerText}>{description}</Text>
                <View style={{ backgroundColor: "#F3F6FA", marginHorizontal: 30, borderRadius: 18 }}>
                    <Text style={styles.subHeaderText}>Date</Text>
                    <Text style={styles.textfieldName}>{date}</Text>
                    <Text style={styles.subHeaderText}>Amount</Text>
                    <Text style={styles.textfieldName}>${amount}</Text>
                    <Text style={styles.subHeaderText}>Category</Text>
                    <Text style={styles.textfieldName}>{selectedCategory}</Text>
                    <Text style={styles.subHeaderText}>Payment Mode</Text>
                    <Text style={styles.textfieldName}>{selectedPaymentMode}</Text>
                    <Picture />
                    <View style={{ marginBottom: 20 }}></View>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default ExpenseDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    headerText: {
        left: 36,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: 600,
        fontSize: 35,
        lineHeight: 68,
        color: '#100D40',
        alignContent: 'center',
        marginTop: 10,
    },
    subHeaderText: {
        left: 25,
        fontFamily: 'Poppins-Regular',
        fontWeight: 400,
        fontSize: 15,
        lineHeight: 24,
        color: '#100D40',
        opacity: 0.65,
        marginTop: 20

    },
    textfieldName: {
        left: 30,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: 400,
        fontSize: 18,
        lineHeight: 26,
        color: '#100D40',
        alignSelf: "flex-end",
        marginTop: -25,
        marginHorizontal: 65,
        width: 120
    },
});