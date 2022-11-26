import React from "react";
import SearchScreen from "../screens/search";
import { createStackNavigator } from "@react-navigation/stack";
import MapContainer from "../../src/components/commons/map/Map";

const Stack = createStackNavigator();
const SearchNavigator = () => {
  return (
    <>
      <Stack.Navigator screenOptions={() => ({ headerShown: false })}>
        <Stack.Screen
          name="search"
          component={SearchScreen}
          // options={() => ({ headerShown: false })}
        />
        <Stack.Screen
          name="map"
          component={MapContainer}
          // options={() => ({ heardershown: false })}
        />
      </Stack.Navigator>
    </>
  );
};

export default SearchNavigator;
