import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { StyleSheet, View, Alert, Text } from "react-native";
import { Button } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("¡No hay usuario en la sesión!");

      let { data, error, status } = await supabase
        .from("login")
        .select(`dni, pass`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setDni(data.dni);
        setPassword(data.pass);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ dni, pass }: { dni: string; pass: string }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("¡No hay usuario en la sesión!");

      const updates = {
        id: session?.user.id,
        dni,
        pass,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("login").upsert(updates);

      if (error) {
        throw error;
      } else {
        Alert.alert("Perfil actualizado con éxito");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text>DNI: {dni}</Text>
      <Button title="Cerrar sesión" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
});
