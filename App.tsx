import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Auth from "./components/Auth";
import Home from "./components/Home";
import Doctores from "./components/Doctores";
import Citas from "./components/Citas";
import Tratamientos from "./components/Tratamientos";
import Pagos from "./components/Pagos";
import Pacientes from "./components/Pacientes"; // Importa la nueva pantalla
import { RootStackParamList } from "./types"; // Ajusta la ruta según tu estructura de carpetas.

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Inicio" }}
        />
        <Stack.Screen
          name="Doctores"
          component={Doctores}
          options={{ title: "Doctores" }}
        />
        <Stack.Screen
          name="Citas"
          component={Citas}
          options={{ title: "Citas" }}
        />
        <Stack.Screen
          name="Tratamientos"
          component={Tratamientos}
          options={{ title: "Tratamientos" }}
        />
        <Stack.Screen
          name="Pagos"
          component={Pagos}
          options={{ title: "Pagos" }}
        />
        <Stack.Screen
          name="Pacientes"
          component={Pacientes} // Añadido el componente de Pacientes
          options={{ title: "Pacientes" }} // Configuración de la pantalla
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
