import React, { createContext, useEffect, useState } from "react";
import "react-native-gesture-handler";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink
} from "@apollo/client";
import { StatusBar } from "expo-status-bar";
import { createUploadLink } from "apollo-upload-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native";
import TabNavigator from "./pages/navigation/tabNavigator";
import HomeScreen from "./pages/screens/home";
import LoginNavigator from "./pages/navigation/loginAuth";
import { onError } from "@apollo/client/link/error";
import { getAccessToken } from "./src/commons/library/utils/getAccessToken";
import LandingPage from "./pages/screens/landing";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

// import DetailsScreen from "./pages/screens/detail";

export const GlobalContext = createContext(null);
const Stack = createStackNavigator();

interface IUserInfo {
  _id?: string;
  email?: string;
  name?: string;
}

function App() {
  const [accessToken, setAccessToken] = useState("");
  // const [isSearchHidden, setIsHomeHidden] = useState("");
  // const [id, setId] = useState("");
  // const [tagId, setTagId] = useState("");
  // const [isFavorite, setIsFavorite] = useState(true);
  // const [isReview, setIsReview] = useState(false);
  // const [isMypage, setMypage] = useState("");
  // const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<IUserInfo>();

  useEffect(() => {
    const getToken = async () => {
      try {
        const getAccessToken = await AsyncStorage.getItem("accessToken");
        const getUserInfo = await AsyncStorage.getItem("userInfo");
        if (getAccessToken) {
          setAccessToken(String(getAccessToken));
        }
        if (getUserInfo) {
          const parsed = JSON.parse(getUserInfo) as IUserInfo;
          if (parsed) {
            setUserInfo(parsed);
          }
        }
      } catch (error) {
        console.log("EffectError", error);
      }
    };
    getToken();
  }, []);

  const uploadLink = createUploadLink({
    uri: "https://backend04-team.codebootcamp.co.kr/team01",
    headers: {
      authorization: `Bearer ${accessToken}`
      // ${(typeof window !== 'undefined' && localStorage.getItem('accessToken'))||''}
    },
    credentials: "include"
  });
  const client = new ApolloClient({
    link: ApolloLink.from([uploadLink as unknown as ApolloLink]),
    cache: new InMemoryCache()
  });
  const value = {
    accessToken: accessToken,
    setAccessToken: setAccessToken,
    userInfo: userInfo,
    setUserInfo: setUserInfo
    // id: id,
    // setId: setId
  };
  const [fontsLoaded] = useFonts({
    Bungee: require("./assets/fonts/Bungee-Regular.ttf"),
    NotoSans: require("./assets/fonts/NotoSansKR-Regular.otf")
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <GlobalContext.Provider value={value}>
        <ApolloProvider client={client}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {accessToken ? (
                <Stack.Screen name="tabNavigator" component={TabNavigator} />
              ) : (
                <Stack.Screen name="Login" component={LoginNavigator} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar />
        </ApolloProvider>
      </GlobalContext.Provider>
    </>
  );
}
export default App;
