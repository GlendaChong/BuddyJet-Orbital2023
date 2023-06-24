import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../../lib/supabase";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faSyncAlt,
  faTrashAlt,
  faBan,
  faChevronRight,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState("");
  const [updatedUserData, setUpdatedUserData] = useState(null);
  const handleLogOut = async () => {
    await supabase.auth.signOut();
  };

  const fetchUserId = async () => {
    try {
      let { data: profiles } = await supabase.from("profiles").select("id");

      const UserID = profiles[0]?.id;
      setUserId(UserID);
    } catch (error) {
      console.error("Error fetching userId", error);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, phone_number, email, date_of_birth");
    if (error) {
      console.error("Error fetching profile:", error.message);
      return;
    }
    setUserData(data[0]);
    setUpdatedUserData(data[0]);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const ProfileBox = ({ label, value }) => (
    <View style={styles.rowContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={updatedUserData ? updatedUserData[value] : ""}
        onChangeText={(text) =>
          setUpdatedUserData((prevState) => ({
            ...prevState,
            [value]: text,
          }))
        }
        style={styles.input}
        underlineColorAndroid="transparent" // Remove default underline
      />
    </View>
  );

  const handleUpdateProfile = async () => {
    console.log(updatedUserData);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: updatedUserData.full_name,
        email: updatedUserData.email,
        phone_number: updatedUserData.phone_number,
        date_of_birth: updatedUserData.date_of_birth,
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating profile:", error.message);
      return;
    }

    setUserData(updatedUserData);
    console.log("Profile updated successfully");
  };

  const handleResetData = (type) => {
    Alert.alert(
      "Reset Confirmation",
      `Are you sure you want to reset ${type}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          onPress: () => {
            resetData(type);
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const resetData = async (type) => {
    // Perform the reset action based on the specified type
    // Reset logic goes here
    if (type == "Expenses") {
      console.log(1);
      const { error } = await supabase
        .from("expenses")
        .delete("*")
        .eq("user_id", userId);

      if (error) {
        console.error(error.message);
      }
    }

    if (type == "Budget") {
      console.log(2);
      const { error } = await supabase
        .from("categories")
        .delete("*")
        .eq("user_id", userId);
      if (error) {
        console.error(error.message);
      }

      const { errors } = await supabase
        .from("budget")
        .delete("*")
        .eq("user_id", userId);
      if (errors) {
        console.error(error.message);
      }
    }

    if (type == "All") {
      console.log(3);
      const { errorss } = await supabase
        .from("expenses")
        .delete("*")
        .eq("user_id", userId);

      if (errorss) {
        console.error(error.message);
      }
      const { error } = await supabase
        .from("categories")
        .delete("*")
        .eq("user_id", userId);
      if (error) {
        console.error(error.message);
      }

      const { errors } = await supabase
        .from("budget")
        .delete("*")
        .eq("user_id", userId);
      if (errors) {
        console.error(error.message);
      }

      const { errorssss } = await supabase
        .from("moneyIn")
        .delete("*")
        .eq("user_id", userId);
    }
    console.log("Reset data", type);
  };

  const AccountBox = () => {
    return (
      <View style={{ marginTop: 30 }}>
        <Text
          style={{
            fontFamily: "Poppins-Medium",
            fontSize: 17,
            marginBottom: 10,
            left: 40,
          }}
        >
          Account
        </Text>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            marginHorizontal: 30,
            paddingHorizontal: 25,
            paddingTop: 20,
          }}
        >
          <TouchableOpacity
            style={styles.resetOption}
            onPress={() => {
              router.push("../Profile/ChangePassword");
            }}
          >
            <View
              style={{
                backgroundColor: "#0A84FF",
                borderRadius: 10,
                padding: 10,
                marginRight: 25,
              }}
            >
              <FontAwesomeIcon icon={faLock} color="white" size={18} />
            </View>
            <Text style={styles.resetOptionText}>Change Password</Text>
            <FontAwesomeIcon icon={faChevronRight} style={{ marginLeft: 30 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ResetBox = () => {
    return (
      <View style={{ marginTop: 30 }}>
        <Text
          style={{
            fontFamily: "Poppins-Medium",
            fontSize: 17,
            marginBottom: 10,
            left: 40,
          }}
        >
          Reset
        </Text>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            marginHorizontal: 30,
            paddingHorizontal: 25,
            paddingTop: 20,
          }}
        >
          <TouchableOpacity
            style={styles.resetOption}
            onPress={() => handleResetData("Expenses")}
          >
            <View style={styles.resetOptionIconContainer}>
              <FontAwesomeIcon icon={faTrashAlt} color="white" size={18} />
            </View>
            <Text style={styles.resetOptionText}>Reset Expenses</Text>
            <FontAwesomeIcon icon={faChevronRight} style={{ marginLeft: 50 }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resetOption}
            onPress={() => handleResetData("Budget")}
          >
            <View style={styles.resetOptionIconContainer}>
              <FontAwesomeIcon icon={faBan} color="white" size={18} />
            </View>
            <Text style={styles.resetOptionText}>Reset Budget</Text>
            <FontAwesomeIcon icon={faChevronRight} style={{ marginLeft: 70 }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resetOption}
            onPress={() => handleResetData("All")}
          >
            <View style={styles.resetOptionIconContainer}>
              <FontAwesomeIcon icon={faSyncAlt} color="white" size={18} />
            </View>
            <Text style={styles.resetOptionText}>Reset All Data</Text>
            <FontAwesomeIcon icon={faChevronRight} style={{ marginLeft: 65 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F6FA" }}>
      <ScrollView>
        <Text style={styles.title}>Profile</Text>

        {userData && (
          <View style={styles.userDataContainer}>
            <ProfileBox label="Name" value="full_name" />
            <ProfileBox label="Number" value="phone_number" />
            <ProfileBox label="Email" value="email" />
            <ProfileBox label="Date of Birth" value="date_of_birth" />
            <View
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: "#EAE9F0",
                width: 351,
                right: 24,
                marginTop: 5,
              }}
            />
            <Button
              style={styles.updateButton}
              labelStyle={styles.updateButtonText}
              onPress={handleUpdateProfile}
            >
              Update
            </Button>
          </View>
        )}
        <AccountBox />
        <ResetBox />
        <View style={{ alignItems: "center", marginTop: 30 }}>
          <Button
            style={styles.logoutButton}
            labelStyle={{ color: "white", fontSize: 18 }}
            onPress={handleLogOut}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 35,
    marginLeft: 40,
    marginTop: 20,
  },
  userDataContainer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  label: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#0A84FF",
    width: 140,
  },
  input: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#2C2646",
    paddingVertical: 5,
    flex: 1,
    marginLeft: 10,
  },
  updateButton: {
    marginHorizontal: 40,
    marginTop: 10,
    backgroundColor: "#fff",
    marginBottom: -10,
  },
  updateButtonText: {
    color: "#0A84FF",
    fontSize: 18,
  },

  resetOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  resetOptionText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#2C2646",
    marginRight: 10,
  },
  resetOptionIconContainer: {
    backgroundColor: "#FF453A",
    borderRadius: 10,
    padding: 10,
    marginRight: 25,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#EAE9F0",
    width: "100%",
    marginBottom: 5,
  },
  logoutButton: {
    marginHorizontal: 40,
    marginTop: 10,
    height: 40,
    width: 280,
    backgroundColor: "#3D70FF",
  },
});

export default Profile;
