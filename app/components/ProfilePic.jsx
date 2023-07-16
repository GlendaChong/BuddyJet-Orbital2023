import { Text, StyleSheet, View, Image } from "react-native";
import { getProfilePic } from "./GetBackendData";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";



function ProfilePic() {
    const [profilePicture, setProfilePicture] = useState(null)

    const getProfilePic = async () => {
        const { data, error } = await supabase
            .from("profiles")
            .select("avatar_url");
        if (error) {
            console.error("Error fetching profile:", error.message);
        }
        const url = data[0]?.avatar_url
        setProfilePicture(url)
    }

    useEffect(() => {
        getProfilePic();
    }, []);

    if (profilePicture !== null) {
        return (
            <Image
                source={{ url: profilePicture }}
                style={{ width: 50, height: 50, borderRadius: 50 }}
            />
        )
    } else {
        return (
            <Image
                source={{
                    url: "https://ewkkuvaxpicleusjtxdm.supabase.co/storage/v1/object/public/avatars/blank-profile-picture-973460_1280.webp?t=2023-07-10T15%3A40%3A57.854Z",
                }}
                style={{ width: 50, height: 50, borderRadius: 50 }}
            />
        )
    }
}

export default ProfilePic
