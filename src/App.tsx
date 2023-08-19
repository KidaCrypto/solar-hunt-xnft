import { registerRootComponent } from "expo";
import { RecoilRoot } from "recoil";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { useFonts, Inter_900Black } from "@expo-google-fonts/dev";

import { CraftingScreen } from "./screens/CraftingScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { InventoryScreen } from "./screens/InventoryScreen";
import { ShopScreen } from "./screens/ShopScreen";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Hunt, HuntResult, getAddressTokens, getHuntHistory, getAddressNfts } from "./helpers/api";
import { usePublicKeys } from "./hooks/xnft-hooks";
import { OnchainNFTDetails } from "./helpers/onchain";

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
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
        name="Crafting"
        component={CraftingScreen}
        options={{
          tabBarLabel: "Crafting",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIcon, {backgroundColor: focused? '#cec2ae' : 'white'}]}>
              <MaterialCommunityIcons name="anvil" color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Tokens",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIcon, {backgroundColor: focused? '#cec2ae' : 'white'}]}>
              <Entypo name="shop" color={color} size={size} />
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
  craftables: OnchainNFTDetails[];
  loots: OnchainNFTDetails[];
  monsters: OnchainNFTDetails[];
  tokens: {
    gold: number;
    exp: number;
  },
  account: string;
  getData?: () => void;
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

const Banner = ({ left, right }: { left?: number, right?: number }) => {
  return (
    <View style={{ position: 'absolute', top: 0, bottom: 0, width: 300, left }}>
      {/* <Image /> */}
    </View>
  )
}

function App() {
  let [fontsLoaded] = useFonts({
    Inter_900Black,
  });

  const [ history, setHistory ] = useState<Hunt[]>([]);
  const [ account, setAccount ] = useState("");
  const [ monsters, setMonsters ] = useState<OnchainNFTDetails[]>([]);
  const [ loots, setLoots ] = useState<OnchainNFTDetails[]>([]);
  const [ craftables, setCraftables ] = useState<OnchainNFTDetails[]>([]);
  const [ tokens, setTokens ] = useState({ gold: 0, exp: 0 });
  const [ isLoading, setIsLoading ] = useState(true);
  const accounts = usePublicKeys();

  const getData = useCallback(async() => {
    if(!account) {
      return;
    }

    let params = { account, isPublicKey: true };

    try {
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
      
      setHistory(hunts);
      setTokens(tokens);
      setMonsters(nfts.monster ?? []);
      setLoots(nfts.loot ?? []);
      setCraftables(nfts.craftable ?? []);
    }

    catch (e){
      setHistory([]);
      setTokens({gold: 0, exp: 0});
      setMonsters([]);
      setLoots([]);
      setCraftables([]);
      setIsLoading(false);
      return;
    }
  }, [ account ]);
  
  useEffect(() => {
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
        <ActivityIndicator size={"large"}/>
      </View>
    );
  }

  if(isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'white' }}>
        <ActivityIndicator size={"large"}/>
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
          account,
          getData
        }}>
          <View style={{ alignItems: 'center', width: '100vw', height: '100vh', backgroundColor: 'white', overflow: 'hidden' }}>
            <View style={{ maxWidth: 500, width: '100%', height: '100%', borderLeftWidth: 1, borderRightWidth: 1 }}>
              <TabNavigator />
            </View>
          </View>
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
