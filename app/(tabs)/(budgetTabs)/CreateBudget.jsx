import { Text } from "react-native"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from 'expo-router';

const createBudget = ({route}) => {
    return (
        <Stack>
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>This is the create budget page. Work in progress!</Text>
            </SafeAreaView>
        </Stack>
    ); 
}

export default createBudget 
