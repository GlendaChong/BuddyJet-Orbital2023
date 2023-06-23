import { Text, StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSyncAlt, faTrashAlt, faBan, faChevronRight, faLock } from "@fortawesome/free-solid-svg-icons";

function Profile() {
    const [userData, setUserData] = useState(null);
    const [updatedUserData, setUpdatedUserData] = useState(null);
    const handleLogOut = async () => {
        await supabase.auth.signOut();
    };

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
        const { error } = await supabase
            .from("profiles")
            .update(updatedUserData)
            .eq("user_id", supabase.auth.user().id);

        if (error) {
            console.error("Error updating profile:", error.message);
            return;
        }

        setUserData(updatedUserData);
        console.log("Profile updated successfully");
    };

    const handleResetData = async () => {
        // Handle the logic to reset expenses data, budget, or all data
        console.log("Reset data");
    };

    const AccountBox = () => {
        return (
            <View style={{ marginTop: 30 }}>
                <Text style={{ fontFamily: "Poppins-Medium", fontSize: 17, marginBottom: 10, left: 40 }}>Account</Text>
                <View style={{ backgroundColor: "#fff", borderRadius: 18, marginHorizontal: 30, paddingHorizontal: 25, paddingTop: 20 }}>
                    <TouchableOpacity style={styles.resetOption} onPress={() => handleResetData("Expenses")}>
                        <View style={{ backgroundColor: "#0A84FF", borderRadius: 10, padding: 10, marginRight: 25 }}>
                            <FontAwesomeIcon icon={faLock} color="white" size={18} />
                        </View>
                        <Text style={styles.resetOptionText}>Change Password</Text>
                        <FontAwesomeIcon icon={faChevronRight} style={{ marginLeft: 30 }} />
                    </TouchableOpacity>
                </View >
            </View >
        );
    }

    const ResetBox = () => {
        return (
            <View style={{ marginTop: 30 }}>
                <Text style={{ fontFamily: "Poppins-Medium", fontSize: 17, marginBottom: 10, left: 40 }}>Reset</Text>
                <View style={{ backgroundColor: "#fff", borderRadius: 18, marginHorizontal: 30, paddingHorizontal: 25, paddingTop: 20 }}>
                    <TouchableOpacity style={styles.resetOption} onPress={() => handleResetData("Expenses")}>
                        <View style={styles.resetOptionIconContainer}>
                            <FontAwesomeIcon icon={faTrashAlt} color="white" size={18} />
                        </View>
                        <Text style={styles.resetOptionText}>Reset Expenses</Text>
                        <FontAwesomeIcon icon={faChevronRight} style={{ marginLeft: 50 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.resetOption} onPress={() => handleResetData("Budget")}>
                        <View style={styles.resetOptionIconContainer}>
                            <FontAwesomeIcon icon={faBan} color="white" size={18} />
                        </View>
                        <Text style={styles.resetOptionText}>Reset Budget</Text>
                        <FontAwesomeIcon icon={faChevronRight} style={{ marginLeft: 70 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.resetOption} onPress={() => handleResetData("All")}>
                        <View style={styles.resetOptionIconContainer}>
                            <FontAwesomeIcon icon={faSyncAlt} color="white" size={18} />
                        </View>
                        <Text style={styles.resetOptionText}>Reset All Data</Text>
                        <FontAwesomeIcon icon={faChevronRight} style={{ marginLeft: 65 }} />
                    </TouchableOpacity>
                </View>
            </View>
        )

    }

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
                        <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#EAE9F0', width: 351, right: 24, marginTop: 5 }} />
                        <Button style={styles.updateButton} labelStyle={styles.updateButtonText} onPress={handleUpdateProfile}>
                            Update
                        </Button>
                    </View>
                )}
                <AccountBox />
                <ResetBox />
                <View style={{ alignItems: 'center', marginTop: 30 }}>
                    <Button style={styles.logoutButton} labelStyle={{ color: 'white', fontSize: 18 }} onPress={handleLogOut}>
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
        marginBottom: -10
    },
    updateButtonText: {
        color: "#0A84FF",
        fontSize: 18
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
        marginRight: 25
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


// import { useState, useEffect } from 'react'
// import { supabase } from "../../lib/supabase";
// import { StyleSheet, View, Alert } from 'react-native'
// import { Button, Input } from 'react-native-elements'
// import { Session } from '@supabase/supabase-js'

// export default function Account({ session }) {
//   const [loading, setLoading] = useState(true)
//   const [username, setUsername] = useState('')
//   const [website, setWebsite] = useState('')
//   const [avatarUrl, setAvatarUrl] = useState('')

//   useEffect(() => {
//     if (session) getProfile()
//   }, [session])

//   async function getProfile() {
//     try {
//       setLoading(true)
//       if (!session?.user) throw new Error('No user on the session!')

//       let { data, error, status } = await supabase
//         .from('profiles')
//         .select(`username, website, avatar_url`)
//         .eq('id', session?.user.id)
//         .single()
//       if (error && status !== 406) {
//         throw error
//       }

//       if (data) {
//         setUsername(data.username)
//         setWebsite(data.website)
//         setAvatarUrl(data.avatar_url)
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         Alert.alert(error.message)
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function updateProfile({ username, website, avatar_url }) {
//     try {
//       setLoading(true)
//       if (!session?.user) throw new Error('No user on the session!')

//       const updates = {
//         id: session?.user.id,
//         username,
//         website,
//         avatar_url,
//         updated_at: new Date(),
//       }

//       let { error } = await supabase.from('profiles').upsert(updates)

//       if (error) {
//         throw error
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         Alert.alert(error.message)
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <View style={styles.container}>
//       <View style={[styles.verticallySpaced, styles.mt20]}>
//         <Input label="Email" value={session?.user?.email} disabled />
//       </View>
//       <View style={styles.verticallySpaced}>
//         <Input label="Username" value={username || ''} onChangeText={(text) => setUsername(text)} />
//       </View>
//       <View style={styles.verticallySpaced}>
//         <Input label="Website" value={website || ''} onChangeText={(text) => setWebsite(text)} />
//       </View>

//       <View style={[styles.verticallySpaced, styles.mt20]}>
//         <Button
//           title={loading ? 'Loading ...' : 'Update'}
//           onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
//           disabled={loading}
//         />
//       </View>

//       <View style={styles.verticallySpaced}>
//         <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
//       </View>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 40,
//     padding: 12,
//   },
//   verticallySpaced: {
//     paddingTop: 4,
//     paddingBottom: 4,
//     alignSelf: 'stretch',
//   },
//   mt20: {
//     marginTop: 20,
//   },
// })



