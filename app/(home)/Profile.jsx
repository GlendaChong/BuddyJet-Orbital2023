import { Text, StyleSheet, View, Input} from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

function Profile() {
    const handleLogOut = async () => {
        await supabase.auth.signOut(); 
    }

    const fetchProfile = async () => {
        await supabase.from('profiles').select('full_name, phone_number, email, date_of_birth' )
    }
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F6FA"}}>
            <ScrollView>
                <Text style={{fontFamily:'Poppins-SemiBold', fontSize:35, marginLeft: 40, marginTop:20}}>Profile</Text>
                <Button style={styles.LogoutButton} onPress={handleLogOut}>Logout</Button>
            </ScrollView>
        </SafeAreaView>
    ); 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },

    //   LogoutButton: {
    //     position: 'absolute', 
    //     marginTop: 700,
    //     alignContent: 'center',
    //   },
},
);   

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



