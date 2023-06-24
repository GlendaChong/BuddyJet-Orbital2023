import { Text } from "react-native-paper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";

function BackButton() {
    const router = useRouter();
    return (
        <>
            <FontAwesomeIcon
                icon={faChevronLeft}
                style={styles.BackButton}
                size={20}
            />
            <Text onPress={() => { router.back(); }} style={styles.BackText} >
                back
            </Text>
        </>
    );
}

const styles = StyleSheet.create({
    BackButton: {
        position: 'absolute',
        marginTop: 7,
        left: 30
    },
    BackText: {
        fontFamily: 'Poppins-Regular',
        fontWeight: 600,
        fontSize: 15,
        position: 'absolute',
        marginTop: 7,
        left: 20,
        color: '#fff',
        opacity: 0.1,
    },
});

export default BackButton; 