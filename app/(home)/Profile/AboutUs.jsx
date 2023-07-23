import { StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";


const AboutUs = () => {
  const router = useRouter(); 
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView>
            <TouchableOpacity style={styles.backButton} onPress={() => { router.back() }}>
                <FontAwesomeIcon
                icon={faChevronLeft}
                size={20}
                />
            </TouchableOpacity>
            <Image style={styles.image} source={require('../../../assets/splash.png')}/>
            <Text style={styles.headerText}>Welcome to BuddyJet!</Text>
            <Text style={styles.descriptionText}>
                Our app aims to ease the process of personal financing for you, by
                helping you with expenses tracking and budgeting. Use the dashboard to
                view how your finances are changing.
            </Text>
            <Text style={styles.descriptionText}>
                If you have any questions or suggestions for us to improve our app, feel
                free to drop us a message on Telegram or connect with us!
            </Text>
            <Text style={styles.headerText}>Developers of BuddyJet</Text>
            <Text style={styles.developersText}>Glenda Chong Rui Ting</Text>
            <Text style={styles.descriptionText}>(Telegram: @Glenda04, LinkedIn: Glenda Chong)</Text>
            <Text style={styles.developersText}>Tay Ru Xin</Text>
            <Text style={styles.descriptionText}>(Telegram: @m_uddy, LinkedIn: Tay Ru Xin)</Text>
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20, 
    backgroundColor: "white",
  },
  backButton: {
    marginLeft: 10,
    marginTop: 20 
  }, 
  headerText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 25,
    lineHeight: 60,
    color: "#100D40",
    textAlign: 'center'
  },
  descriptionText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    lineHeight: 24,
    color: "#100D40",
    marginBottom: 20,
    textAlign: 'center'
  },
  developersText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    lineHeight: 30,
    color: "#100D40",
    textAlign: 'center'
  },
  image: {
    width: 300,
    height: 200,
    alignSelf: 'center',  
  }, 
});

export default AboutUs;
