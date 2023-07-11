import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
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
  faCamera,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import * as ImagePicker from "expo-image-picker";

function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [dob, setDob] = useState("");

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
      .select("full_name, phone_number, email, date_of_birth, avatar_url");
    if (error) {
      console.error("Error fetching profile:", error.message);
      return;
    }
    setUserData(data[0]);
    setName(data[0]?.full_name);
    setNumber(data[0]?.phone_number);
    setEmail(data[0]?.email);
    setDob(data[0]?.date_of_birth);

    if (data[0]?.avatar_url !== null) {
      setProfilePicture(data[0]?.avatar_url);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    const dateFormat = /^(\d{2}-)(\d{2}-)(\d{4})$/;

    if (!/^\d+$/.test(number)) {
      Alert.alert("Error", "Please enter a valid phone number", [
        { text: "OK", style: "destructive" },
      ]);
      return;
    }

    if (dob == "") {
      Alert.alert("Error", "Date of Birth cannot be empty", [
        { text: "OK", style: "destructive" },
      ]);
      return;
    } else if (!dob.match(dateFormat)) {
      Alert.alert("Error", "Date of Birth must be in DD-MM-YYYY format", [
        { text: "OK", style: "destructive" },
      ]);
      return;
    }

    if (email == "") {
      Alert.alert("Error", "Email cannot be empty", [
        { text: "OK", style: "destructive" },
      ]);
      return;
    }

    if (profilePicture) {
      // Upload the profile picture to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        // .upload(`user_${userId}.jpg`, file);
        .upload(`${new Date().getTime()}`, {
          uri: profilePicture,
          type: "jpeg",
          name: "name.jpeg",
        });

      if (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(data.path);

      console.log(publicUrl);

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: name,
          email: email,
          phone_number: number,
          date_of_birth: dob,
          avatar_url: publicUrl,
        })
        .eq("id", userId);

      Alert.alert("Success", "Profile updated successfully");

      if (error) {
        console.error("Error updating profile:", error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: name,
          email: email,
          phone_number: number,
          date_of_birth: dob,
        })
        .eq("id", userId);

      if (error) {
        console.error("Error updating profile:", error.message);
        return;
      }
      console.log("Profile updated successfully");
      Alert.alert("Success", "Profile updated successfully");
    }
  };

  const handleSelectProfilePicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
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
            {profilePicture !== null ? (
              <Image
                source={{ uri: profilePicture }}
                style={{ width: 120, height: 120, borderRadius: 100, top: 10 }}
              />
            ) : (
              <Image
                source={{
                  url: "https://ewkkuvaxpicleusjtxdm.supabase.co/storage/v1/object/public/avatars/blank-profile-picture-973460_1280.webp?t=2023-07-10T15%3A40%3A57.854Z",
                }}
                style={{ width: 120, height: 120, borderRadius: 100, top: 10 }}
              />
            )}
            <View>
              <TouchableOpacity
                onPress={handleSelectProfilePicture}
                style={{
                  backgroundColor: "#0A84FF",
                  width: 40,
                  height: 40,
                  borderRadius: 100,
                  left: 80,
                  top: -30,
                }}
              >
                <FontAwesomeIcon
                  icon={faCamera}
                  color="white"
                  size={20}
                  style={{
                    left: 11,
                    top: 10,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ left: 160, marginTop: -155 }}>
              <TextInput
                value={name}
                style={{
                  width: 130,
                  fontSize: 25,
                  marginBottom: 10,
                  fontFamily: "Poppins-SemiBold",
                }}
                onChangeText={setName}
                placeholder={name}
              />

              <TextInput
                value={number}
                style={{
                  width: 130,
                  fontSize: 15,
                  marginBottom: 8,
                  fontFamily: "Poppins-Regular",
                }}
                onChangeText={setNumber}
                placeholder={number}
              />
              <TextInput
                value={dob}
                style={{
                  width: 130,
                  fontSize: 15,
                  marginBottom: 8,
                  fontFamily: "Poppins-Regular",
                }}
                onChangeText={setDob}
                placeholder={dob}
              />
              <TextInput
                value={email}
                style={{
                  width: 130,
                  fontSize: 15,
                  marginBottom: 20,
                  fontFamily: "Poppins-Regular",
                }}
                onChangeText={setEmail}
                placeholder={email}
              />
            </View>
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
    marginBottom: 2,
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
