import { StyleSheet, Image } from "react-native";

function ProfilePic({ profilePicture }) {
    if (profilePicture !== null) {
        return (
            <Image
                source={{ url: profilePicture }}
                style={styles.image}
            />
        ); 
    } else {
        return (
            <Image
                source={{
                    url: "https://ewkkuvaxpicleusjtxdm.supabase.co/storage/v1/object/public/avatars/blank-profile-picture-973460_1280.webp?t=2023-07-10T15%3A40%3A57.854Z",
                }}
                style={styles.image}
            />
        ); 
    }
}

const styles = StyleSheet.create({
    image: {
        width: 50, 
        height: 50, 
        borderRadius: 50
    }
}); 

export default ProfilePic; 
