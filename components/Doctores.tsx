import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import { supabase } from "../lib/supabase"; // Usa la configuración que ya definiste

type Doctor = {
  doctor_id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
  correo: string;
};

export default function DoctoresCRUD() {
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");

  // Obtener todos los doctores
  const fetchDoctores = async () => {
    const { data, error } = await supabase.from("doctores").select("*");
    if (error) {
      Alert.alert("Error", "No se pudieron cargar los doctores");
      console.error(error);
    } else {
      setDoctores(data);
    }
  };

  // Crear un nuevo doctor
  const addDoctor = async () => {
    const { error } = await supabase
      .from("doctores")
      .insert([{ nombre, apellido, especialidad, telefono, correo }]);
    if (error) {
      Alert.alert("Error", "No se pudo agregar el doctor");
      console.error(error);
    } else {
      Alert.alert("Éxito", "Doctor agregado correctamente");
      fetchDoctores();
      setNombre("");
      setApellido("");
      setEspecialidad("");
      setTelefono("");
      setCorreo("");
    }
  };

  // Eliminar un doctor
  const deleteDoctor = async (id: number) => {
    const { error } = await supabase
      .from("doctores")
      .delete()
      .eq("doctor_id", id);
    if (error) {
      Alert.alert("Error", "No se pudo eliminar el doctor");
      console.error(error);
    } else {
      Alert.alert("Éxito", "Doctor eliminado correctamente");
      fetchDoctores();
    }
  };

  useEffect(() => {
    fetchDoctores();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctores</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />
        <TextInput
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
          style={styles.input}
        />
        <TextInput
          placeholder="Especialidad"
          value={especialidad}
          onChangeText={setEspecialidad}
          style={styles.input}
        />
        <TextInput
          placeholder="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
          style={styles.input}
        />
        <TextInput
          placeholder="Correo"
          value={correo}
          onChangeText={setCorreo}
          style={styles.input}
        />
        <Button title="Agregar Doctor" onPress={addDoctor} />
      </View>
      <FlatList
        data={doctores}
        keyExtractor={(item) => item.doctor_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{`${item.nombre} ${item.apellido} - ${item.especialidad}`}</Text>
            <Button
              title="Eliminar"
              onPress={() => deleteDoctor(item.doctor_id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  form: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});
