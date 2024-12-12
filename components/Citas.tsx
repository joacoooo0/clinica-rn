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
import { Picker } from "@react-native-picker/picker"; // Importamos Picker

type Cita = {
  cita_id: number;
  paciente_id: number;
  doctor_id: number;
  fecha: string;
  motivo: string;
  estado: string;
};

export default function CitasCRUD() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [fecha, setFecha] = useState("");
  const [motivo, setMotivo] = useState("");
  const [estado, setEstado] = useState("pendiente");

  // Obtener pacientes
  const fetchPacientes = async () => {
    const { data, error } = await supabase.from("pacientes").select("*");
    if (error) {
      Alert.alert("Error", "No se pudieron cargar los pacientes");
      console.error(error);
    } else {
      setPacientes(data);
    }
  };

  // Obtener doctores
  const fetchDoctores = async () => {
    const { data, error } = await supabase.from("doctores").select("*");
    if (error) {
      Alert.alert("Error", "No se pudieron cargar los doctores");
      console.error(error);
    } else {
      setDoctores(data);
    }
  };

  // Obtener todas las citas
  const fetchCitas = async () => {
    const { data, error } = await supabase.from("citas").select("*");
    if (error) {
      Alert.alert("Error", "No se pudieron cargar las citas");
      console.error(error);
    } else {
      setCitas(data);
    }
  };

  // Crear una nueva cita
  const addCita = async () => {
    if (!pacienteId || !doctorId || !fecha || !motivo) {
      Alert.alert("Error", "Por favor llena todos los campos.");
      return;
    }

    const { error } = await supabase.from("citas").insert([
      {
        paciente_id: parseInt(pacienteId),
        doctor_id: parseInt(doctorId),
        fecha,
        motivo,
        estado,
      },
    ]);
    if (error) {
      Alert.alert("Error", "No se pudo agregar la cita");
      console.error(error);
    } else {
      Alert.alert("Éxito", "Cita agregada correctamente");
      fetchCitas();
      setPacienteId("");
      setDoctorId("");
      setFecha("");
      setMotivo("");
      setEstado("pendiente");
    }
  };

  // Eliminar una cita
  const deleteCita = async (id: number) => {
    const { error } = await supabase.from("citas").delete().eq("cita_id", id);
    if (error) {
      Alert.alert("Error", "No se pudo eliminar la cita");
      console.error(error);
    } else {
      Alert.alert("Éxito", "Cita eliminada correctamente");
      fetchCitas();
    }
  };

  useEffect(() => {
    fetchPacientes();
    fetchDoctores();
    fetchCitas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Citas</Text>
      <View style={styles.form}>
        {/* Selección de Paciente */}
        <Text>Seleccione el paciente:</Text>
        <Picker
          selectedValue={pacienteId}
          onValueChange={setPacienteId}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione un paciente" value="" />
          {pacientes.map((paciente) => (
            <Picker.Item
              key={paciente.paciente_id}
              label={`${paciente.nombre} ${paciente.apellido}`}
              value={paciente.paciente_id.toString()}
            />
          ))}
        </Picker>

        {/* Selección de Doctor */}
        <Text>Seleccione el doctor:</Text>
        <Picker
          selectedValue={doctorId}
          onValueChange={setDoctorId}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione un doctor" value="" />
          {doctores.map((doctor) => (
            <Picker.Item
              key={doctor.doctor_id}
              label={`${doctor.nombre} ${doctor.apellido}`}
              value={doctor.doctor_id.toString()}
            />
          ))}
        </Picker>

        {/* Otros campos de la cita */}
        <TextInput
          placeholder="Fecha"
          value={fecha}
          onChangeText={setFecha}
          style={styles.input}
        />
        <TextInput
          placeholder="Motivo"
          value={motivo}
          onChangeText={setMotivo}
          style={styles.input}
        />
        <TextInput
          placeholder="Estado"
          value={estado}
          onChangeText={setEstado}
          style={styles.input}
        />
        <Button title="Agregar Cita" onPress={addCita} />
      </View>
      <FlatList
        data={citas}
        keyExtractor={(item) => item.cita_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{`Paciente ID: ${item.paciente_id} - Doctor ID: ${item.doctor_id} - Fecha: ${item.fecha}`}</Text>
            <Button title="Eliminar" onPress={() => deleteCita(item.cita_id)} />
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
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
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
