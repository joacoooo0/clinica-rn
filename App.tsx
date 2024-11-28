import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Auth from "./components/Auth";
import Home from "./components/Home";
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
