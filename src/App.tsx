import { registerRootComponent } from "expo";
import { RecoilRoot } from "recoil";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts, Inter_900Black } from "@expo-google-fonts/dev";

import { ExamplesScreens } from "./screens/ExamplesScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { InventoryScreen } from "./screens/InventoryScreen";
import { createContext, useContext, useEffect, useState } from "react";
import { Hunt, HuntResult, getAddressTokens, getHuntHistory, getAddressNfts } from "./helpers/api";
import { usePublicKeys } from "./hooks/xnft-hooks";
import { getCraftableCollectionAddress, getLootCollectionAddress, getMonsterCollectionAddress } from "./utils/common";
import { ReadApiAsset } from "./helpers/onchain";

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Inventory"
      screenOptions={{
        tabBarActiveTintColor: "black",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          position: 'absolute',
          left: 0,
          bottom: 20,
          elevation: 0,
          borderTopWidth: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIcon, {backgroundColor: focused? '#cec2ae' : 'white'}]}>
              <MaterialCommunityIcons name="sword" color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Tokens",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIcon, {backgroundColor: focused? '#cec2ae' : 'white'}]}>
              <MaterialCommunityIcons name="treasure-chest" color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Examples"
        component={ExamplesScreens}
        options={{
          tabBarLabel: "Examples",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIcon, {backgroundColor: focused? '#cec2ae' : 'white'}]}>
              <MaterialCommunityIcons name="anvil" color={color} size={size} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// might need to change to use reducers
export const AddressContext = createContext<{
  history: Hunt[],
  craftables: ReadApiAsset[];
  loots: ReadApiAsset[];
  monsters: ReadApiAsset[];
  tokens: {
    gold: number;
    exp: number;
  },
  account: string;
}>({
  history: [],
  craftables: [], // address owned craftables
  loots: [], // address owned loots
  monsters: [], // address owned monsters
  tokens: {
    gold: 0, // address owned gold tokens
    exp: 0, // address owned exp tokens
  },
  account: "",
});

export const MetadataContext = createContext({
  monsters: [],
  craftables: [],
  loots: [],
});

function App() {
  let [fontsLoaded] = useFonts({
    Inter_900Black,
  });

  const [ history, setHistory ] = useState<Hunt[]>([]);
  const [ account, setAccount ] = useState("");
  const [ monsters, setMonsters ] = useState<ReadApiAsset[]>([]);
  const [ loots, setLoots ] = useState<ReadApiAsset[]>([]);
  const [ craftables, setCraftables ] = useState<ReadApiAsset[]>([]);
  const [ tokens, setTokens ] = useState({ gold: 0, exp: 0 });
  const [ isLoading, setIsLoading ] = useState(true);
  const accounts = usePublicKeys();
  
  useEffect(() => {
    const getData = async() => {
      if(!account) {
        return;
      }

      let params = { account, isPublicKey: true };

      let [hunts, tokens, nfts] = await Promise.all([
        getHuntHistory(params),
        getAddressTokens(params),
        getAddressNfts(params),
      ]);

      // 0.5s load time
      setTimeout(() => {
        setIsLoading(false);
      }, 500);

      if(typeof hunts === "string") {
        setHistory([]);
        setTokens({gold: 0, exp: 0});
        setMonsters([]);
        setLoots([]);
        setCraftables([]);
        return;
      }

      if(typeof tokens === "string") {
        setHistory([]);
        setTokens({gold: 0, exp: 0});
        setMonsters([]);
        setLoots([]);
        setCraftables([]);
        return;
      }

      if(typeof nfts === "string") {
        setHistory([]);
        setTokens({gold: 0, exp: 0});
        setMonsters([]);
        setLoots([]);
        setCraftables([]);
        return;
      }

      console.log(hunts);
      let monsters = nfts.filter(x => x.grouping[0].group_value === getMonsterCollectionAddress());
      let loots = nfts.filter(x => x.grouping[0].group_value === getLootCollectionAddress());
      let craftables = nfts.filter(x => x.grouping[0].group_value === getCraftableCollectionAddress());
      
      setHistory(hunts);
      setTokens(tokens);
      setMonsters(monsters);
      setLoots(loots);
      setCraftables(craftables);
    }

    getData();
  }, [ account ]);

  useEffect(() => {
    if(!accounts) {
      setAccount("");
      return;
    }

    if(!accounts.solana) {
      setAccount("");
      return;
    }

    setAccount(accounts.solana);
  }, [ accounts ]);

  // need custom loader
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'white' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if(isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'white' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <RecoilRoot>
      <NavigationContainer>
        <AddressContext.Provider value={{
          history,
          craftables, // address owned craftables
          loots, // address owned loots
          monsters, // address owned monsters
          tokens,
          account
        }}>
          <TabNavigator />
        </AddressContext.Provider>
      </NavigationContainer>
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({
  tabIcon: { 
    borderRadius: 50, 
    padding: 10, 
    // borderWidth: StyleSheet.hairlineWidth,
    shadowColor: 'black',
    shadowRadius: 5,
  },
})

export default registerRootComponent(App);
