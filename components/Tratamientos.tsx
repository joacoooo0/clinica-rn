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
import { supabase } from "../lib/supabase"; // Asegúrate de tener la configuración correcta de Supabase

type Tratamiento = {
  tratamiento_id: number;
  nombre: string;
  descripcion: string;
  costo: string;
};

export default function TratamientosCRUD() {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [costo, setCosto] = useState("");

  // Obtener todos los tratamientos
  const fetchTratamientos = async () => {
    const { data, error } = await supabase.from("tratamientos").select("*");
    if (error) {
      Alert.alert("Error", "No se pudieron cargar los tratamientos");
      console.error(error);
    } else {
      setTratamientos(data);
    }
  };

  // Crear un nuevo tratamiento
  const addTratamiento = async () => {
    if (!nombre || !descripcion || !costo) {
      Alert.alert("Error", "Por favor llena todos los campos.");
      return;
    }

    const { error } = await supabase.from("tratamientos").insert([
      {
        nombre,
        descripcion,
        costo: parseFloat(costo),
      },
    ]);
    if (error) {
      Alert.alert("Error", "No se pudo agregar el tratamiento");
      console.error(error);
    } else {
      Alert.alert("Éxito", "Tratamiento agregado correctamente");
      fetchTratamientos();
      setNombre("");
      setDescripcion("");
      setCosto("");
    }
  };

  // Eliminar un tratamiento
  const deleteTratamiento = async (id: number) => {
    const { error } = await supabase
      .from("tratamientos")
      .delete()
      .eq("tratamiento_id", id);
    if (error) {
      Alert.alert("Error", "No se pudo eliminar el tratamiento");
      console.error(error);
    } else {
      Alert.alert("Éxito", "Tratamiento eliminado correctamente");
      fetchTratamientos();
    }
  };

  useEffect(() => {
    fetchTratamientos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tratamientos</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Nombre del Tratamiento"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />
        <TextInput
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
          style={styles.input}
        />
        <TextInput
          placeholder="Costo"
          value={costo}
          onChangeText={setCosto}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button title="Agregar Tratamiento" onPress={addTratamiento} />
      </View>
      <FlatList
        data={tratamientos}
        keyExtractor={(item) => item.tratamiento_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{`${item.nombre} - $${item.costo}`}</Text>
            <Button
              title="Eliminar"
              onPress={() => deleteTratamiento(item.tratamiento_id)}
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
