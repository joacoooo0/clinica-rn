import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import { supabase } from "../lib/supabase"; // Asegúrate de tener la configuración correcta de Supabase
import DateTimePicker from "@react-native-community/datetimepicker";

type Paciente = {
  paciente_id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  telefono: string;
  correo: string;
  direccion: string;
  historial_medico: string;
};

export default function PacientesCRUD() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [historialMedico, setHistorialMedico] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Obtener todos los pacientes
  const fetchPacientes = async () => {
    const { data, error } = await supabase.from("pacientes").select("*");
    if (error) {
      Alert.alert("Error", "No se pudieron cargar los pacientes");
      console.error(error);
    } else {
      setPacientes(data);
    }
  };

  // Crear un nuevo paciente
  const addPaciente = async () => {
    const { error } = await supabase.from("pacientes").insert([
      {
        nombre,
        apellido,
        fecha_nacimiento: fechaNacimiento, // Usamos la fecha como string en formato ISO
        telefono,
        correo,
        direccion,
        historial_medico: historialMedico,
      },
    ]);
    if (error) {
      Alert.alert("Error", "No se pudo agregar el paciente");
      console.error(error);
    } else {
      Alert.alert("Éxito", "Paciente agregado correctamente");
      fetchPacientes();
      setNombre("");
      setApellido("");
      setFechaNacimiento("");
      setTelefono("");
      setCorreo("");
      setDireccion("");
      setHistorialMedico("");
    }
  };

  // Eliminar un paciente
  const deletePaciente = async (id: number) => {
    const { error } = await supabase
      .from("pacientes")
      .delete()
      .eq("paciente_id", id);
    if (error) {
      Alert.alert("Error", "No se pudo eliminar el paciente");
      console.error(error);
    } else {
      Alert.alert("Éxito", "Paciente eliminado correctamente");
      fetchPacientes();
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setFechaNacimiento(currentDate.toISOString().split("T")[0]); // Almacenamos la fecha en formato YYYY-MM-DD
    setShowDatePicker(false);
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pacientes</Text>
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

        {/* Condicional para el selector de fecha */}
        {Platform.OS !== "web" ? (
          <View style={styles.input}>
            <Button
              title="Seleccionar Fecha de Nacimiento"
              onPress={() => setShowDatePicker(true)}
            />
            {fechaNacimiento ? (
              <Text>Fecha seleccionada: {fechaNacimiento}</Text>
            ) : null}
          </View>
        ) : (
          <TextInput
            placeholder="Fecha de Nacimiento"
            value={fechaNacimiento}
            onChangeText={setFechaNacimiento}
            style={styles.input}
            keyboardType="default"
          />
        )}

        {showDatePicker && Platform.OS !== "web" && (
          <DateTimePicker
            value={fechaNacimiento ? new Date(fechaNacimiento) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

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
        <TextInput
          placeholder="Dirección"
          value={direccion}
          onChangeText={setDireccion}
          style={styles.input}
        />
        <TextInput
          placeholder="Historial Médico"
          value={historialMedico}
          onChangeText={setHistorialMedico}
          style={styles.input}
        />
        <Button title="Agregar Paciente" onPress={addPaciente} />
      </View>
      <FlatList
        data={pacientes}
        keyExtractor={(item) => item.paciente_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{`${item.nombre} ${item.apellido} - ${item.telefono}`}</Text>
            <Button
              title="Eliminar"
              onPress={() => deletePaciente(item.paciente_id)}
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
