import { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router"

function sum(a, b) {
  return a + b;
}
module.exports = sum;