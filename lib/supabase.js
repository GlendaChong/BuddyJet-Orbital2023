import 'react-native-url-polyfill/auto'
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from '@react-native-async-storage/async-storage'

import * as SecureStore from 'expo-secure-store'

const ExpoSecureStoreAdapter = {
      getItem: (key) => {
        return SecureStore.getItemAsync(key)
      },
      setItem: (key, value) => {
        SecureStore.setItemAsync(key, value)
      },
      removeItem: (key) => {
        SecureStore.deleteItemAsync(key)
      },
    }
    

const projectUrl = process.env.SUPABASE_PROJECT_URL
const projectKey = process.env.SUPABASE_PROJECT_KEY

export const supabase = createClient(projectUrl, projectKey, {
    auth: {
        // localStorage: AsyncStorage,
        storage: ExpoSecureStoreAdapter, 
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    }
});