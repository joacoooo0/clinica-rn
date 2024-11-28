import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { supabase } from "../lib/supabase";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

export default function Auth() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  async function signIn() {
    setLoading(true);

    const { data, error } = await supabase
      .from("login")
      .select("*")
      .eq("dni", dni)
      .single();

    if (error || !data) {
      Alert.alert("Error", "Credenciales incorrectas");
    } else if (data.pass !== password) {
      Alert.alert("Error", "Contraseña incorrecta");
    } else {
      Alert.alert("Éxito", "Inicio de sesión exitoso");
      navigation.navigate("Home");
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.welcomeText}>¡Bienvenido!</Text>
      <Input
        placeholder="Dni"
        onChangeText={(text) => setDni(text)}
        value={dni}
        containerStyle={styles.inputContainer}
        inputStyle={styles.input}
        autoCapitalize="none"
      />
      <Input
        placeholder="Contraseña"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
        containerStyle={styles.inputContainer}
        inputStyle={styles.input}
        autoCapitalize="none"
      />
      <TouchableOpacity
        onPress={() => Alert.alert("Funcionalidad no implementada")}
      >
        <Text style={styles.forgotPassword}>¿Olvidaste la contraseña?</Text>
      </TouchableOpacity>
      <Button
        title="Ingresar"
        buttonStyle={styles.button}
        disabled={loading}
        onPress={signIn}
      />
      <Text style={styles.footerText}>Clínica Dental Calderón</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  logo: {
    width: 400,
    height: 450,
    resizeMode: "contain",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    width: "85%",
    marginBottom: 10,
  },
  input: {
    textAlign: "center",
  },
  forgotPassword: {
    color: "#007BFF",
    fontSize: 14,
    marginVertical: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007BFF",
    width: "auto",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  footerText: {
    marginTop: 20,
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
});
