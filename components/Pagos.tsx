import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Picker,
  StyleSheet,
  Alert,
} from "react-native";
import { supabase } from "../lib/supabase"; // Asegúrate de tener tu configuración correcta de Supabase

// Definir los tipos de datos
type Pago = {
  pago_id: number;
  paciente_id: number;
  tratamiento_id: number;
  fecha_pago: string;
  monto: number;
  estado: string;
};

type Paciente = {
  paciente_id: number;
  nombre: string;
};

type Tratamiento = {
  tratamiento_id: number;
  nombre: string;
};

const PagosCRUD = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [tratamientoId, setTratamientoId] = useState<number | null>(null);
  const [fechaPago, setFechaPago] = useState("");
  const [monto, setMonto] = useState("");
  const [estado, setEstado] = useState("");

  // Obtener pacientes y tratamientos
  const fetchPacientesTratamientos = async () => {
    const { data: pacientesData, error: pacientesError } = await supabase
      .from("pacientes")
      .select("paciente_id, nombre");

    if (pacientesError) {
      Alert.alert("Error", "No se pudieron cargar los pacientes");
      console.error(pacientesError);
    } else {
      setPacientes(pacientesData);
    }

    const { data: tratamientosData, error: tratamientosError } = await supabase
      .from("tratamientos")
      .select("tratamiento_id, nombre");

    if (tratamientosError) {
      Alert.alert("Error", "No se pudieron cargar los tratamientos");
      console.error(tratamientosError);
    } else {
      setTratamientos(tratamientosData);
    }
  };

  // Obtener todos los pagos
  const fetchPagos = async () => {
    const { data, error } = await supabase.from("pagos").select("*");
    if (error) {
      Alert.alert("Error", "No se pudieron cargar los pagos");
      console.error(error);
    } else {
      setPagos(data);
    }
  };

  // Crear un nuevo pago
  const addPago = async () => {
    if (!pacienteId || !tratamientoId || !fechaPago || !monto || !estado) {
      Alert.alert("Error", "Por favor complete todos los campos");
      return;
    }

    const { error } = await supabase.from("pagos").insert([
      {
        paciente_id: pacienteId,
        tratamiento_id: tratamientoId,
        fecha_pago: fechaPago,
        monto: parseFloat(monto),
        estado,
      },
    ]);
    if (error) {
      Alert.alert("Error", "No se pudo agregar el pago");
      console.error(error);
    } else {
      Alert.alert("Éxito", "Pago agregado correctamente");
      fetchPagos();
      setPacienteId(null);
      setTratamientoId(null);
      setFechaPago("");
      setMonto("");
      setEstado("");
    }
  };

  // Eliminar un pago
  const deletePago = async (id: number) => {
    const { error } = await supabase.from("pagos").delete().eq("pago_id", id);
    if (error) {
      Alert.alert("Error", "No se pudo eliminar el pago");
      console.error(error);
    } else {
      Alert.alert("Éxito", "Pago eliminado correctamente");
      fetchPagos();
    }
  };

  useEffect(() => {
    fetchPagos();
    fetchPacientesTratamientos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagos</Text>
      <View style={styles.form}>
        <Picker
          selectedValue={pacienteId}
          onValueChange={(itemValue) => setPacienteId(itemValue)}
        >
          <Picker.Item label="Seleccionar Paciente" value={null} />
          {pacientes.map((paciente) => (
            <Picker.Item
              key={paciente.paciente_id}
              label={`${paciente.nombre}`}
              value={paciente.paciente_id}
            />
          ))}
        </Picker>
        <Picker
          selectedValue={tratamientoId}
          onValueChange={(itemValue) => setTratamientoId(itemValue)}
        >
          <Picker.Item label="Seleccionar Tratamiento" value={null} />
          {tratamientos.map((tratamiento) => (
            <Picker.Item
              key={tratamiento.tratamiento_id}
              label={tratamiento.nombre}
              value={tratamiento.tratamiento_id}
            />
          ))}
        </Picker>
        <TextInput
          placeholder="Fecha de Pago"
          value={fechaPago}
          onChangeText={setFechaPago}
          style={styles.input}
        />
        <TextInput
          placeholder="Monto"
          value={monto}
          onChangeText={setMonto}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Estado (Ej: pagado, pendiente)"
          value={estado}
          onChangeText={setEstado}
          style={styles.input}
        />
        <Button title="Agregar Pago" onPress={addPago} />
      </View>

      <FlatList
        data={pagos}
        keyExtractor={(item) => item.pago_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{`Paciente ID: ${item.paciente_id} - Monto: ${item.monto} - Estado: ${item.estado}`}</Text>
            <Button title="Eliminar" onPress={() => deletePago(item.pago_id)} />
          </View>
        )}
      />
    </View>
  );
};

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

export default PagosCRUD;
