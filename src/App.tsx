import { registerRootComponent } from "expo";
import { RecoilRoot } from "recoil";
import { ActivityIndicator, StyleSheet, View, Text, TextInput, Button, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Entypo, FontAwesome5 } from "@expo/vector-icons";

import { CraftingScreen } from "./screens/CraftingScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { InventoryScreen } from "./screens/InventoryScreen";
import { ShopScreen } from "./screens/ShopScreen";
import { MigrateScreen } from "./screens/MigrateScreen";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Hunt, HuntResult, getAddressTokens, getHuntHistory, getAddressNfts, getPublicKeyForNonPublicKeyAccount, getAddressMigrationLinks } from "./helpers/api";
import { usePublicKeys } from "./hooks/xnft-hooks";
import { OnchainNFTDetails } from "./helpers/onchain";

const logo = require('../assets/icon.png');
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
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIcon, {backgroundColor: focused? '#cec2ae' : 'white'}]}>
              <MaterialCommunityIcons name="sword" color={color} size={40} />
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
        name="Migrate"
        component={MigrateScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Migrate",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIcon, {backgroundColor: focused? '#cec2ae' : 'white'}]}>
              <MaterialCommunityIcons name="account-arrow-right" color={color} size={size} />
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
  inputAccount: string;
  isPublicKey: boolean;
  migrationLink: string;
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
  inputAccount: "",
  migrationLink: "",
  isPublicKey: true,
});

const Banner = ({ left, right }: { left?: number, right?: number }) => {
  return (
    <View style={{ position: 'absolute', top: 0, bottom: 0, width: 300, left }}>
      {/* <Image /> */}
    </View>
  )
}

function App() {
  const [ history, setHistory ] = useState<Hunt[]>([]);
  const [ account, setAccount ] = useState("");
  const [ monsters, setMonsters ] = useState<OnchainNFTDetails[]>([]);
  const [ loots, setLoots ] = useState<OnchainNFTDetails[]>([]);
  const [ craftables, setCraftables ] = useState<OnchainNFTDetails[]>([]);
  const [ tokens, setTokens ] = useState({ gold: 0, exp: 0 });
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isPublicKey, setIsPublicKey ] = useState(true);
  const [ migrationLink, setMigrationLink ] = useState("");
  const [ inputAccount, setInputAccount ] = useState("");
  const accounts = usePublicKeys();

  const login = useCallback(async () => {
    setIsLoading(true);
    try {
      let account = await getPublicKeyForNonPublicKeyAccount(inputAccount);

      if(!account) {
        alert('Unable to login');
        return;
      }
      setAccount(account);
      setIsPublicKey(false);
    }

    catch {
      alert('Unable to login');
    }
  }, [ inputAccount ]);

  const getData = useCallback(async() => {
    if(!account) {
      setIsLoading(false);
      return;
    }

    // use back the keyed in account for simplicity since every backend logic is handled by this
    let params = { account: isPublicKey? account : inputAccount, isPublicKey };

    try {
      let [hunts, tokens, nfts, migrationLinks] = await Promise.all([
        getHuntHistory(params),
        getAddressTokens(params),
        getAddressNfts(params),
        getAddressMigrationLinks(params),
      ]);

      setIsLoading(false);

      if(typeof migrationLinks !== "string" && migrationLinks.length > 0) {
        setMigrationLink(migrationLinks[0].migration_link);
        setHistory([]);
        setTokens({gold: 0, exp: 0});
        setMonsters([]);
        setLoots([]);
        setCraftables([]);
        return;
      }

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
  }, [ account, isPublicKey ]);
  
  useEffect(() => {
    setIsLoading(true);
    getData();
  }, [ account ]);

  useEffect(() => {
    // 0.5s load time
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  // get xnft solana address if available
  // sometimes it will not show account
  useEffect(() => {
    if(!window.xnft) {
      return;
    }

    if(!window.xnft.solana) {
      return;
    }

    if(!window.xnft.publicKeys) {
      return;
    }

    if(!window.xnft.publicKeys.solana) {
      return;
    }

    if(account) {
      return;
    }

    setAccount(window.xnft.publicKeys.solana);
  }, []);

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

  if(isLoading) {
    return (

      <View style={{ alignItems: 'center', width: '100vw', height: '100vh', backgroundColor: 'white', overflow: 'hidden' }}>
        <View style={{ maxWidth: 500, width: '100%', height: '100%', borderLeftWidth: 1, borderRightWidth: 1, shadowColor: 'black', shadowRadius: 15 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: "center", backgroundColor: 'white', maxWidth: 500 }}>
            <Text style={{ letterSpacing: 5, textTransform: 'uppercase', marginBottom: 15, fontSize: 15 }}>Logging In...</Text>
            <ActivityIndicator size={"large"}/>
          </View>
        </View>
      </View>
    );
  }

  if(migrationLink) {
    return (
      <View style={{ alignItems: 'center', width: '100vw', height: '100vh', backgroundColor: 'white', overflow: 'hidden' }}>
        <View style={{ maxWidth: 500, width: '100%', height: '100%', borderLeftWidth: 1, borderRightWidth: 1, shadowColor: 'black', shadowRadius: 15 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: "center", backgroundColor: 'white', maxWidth: 500 }}>
            <Image
              source={logo}
              style={{ width: 250, height: 250, marginBottom: 30 }}
            />
            <View style={{ width: '80%', alignItems: 'center'}}>
              <Text style={{ letterSpacing: 5, textTransform: 'uppercase', fontWeight: 'bold' }}>Account Migrated</Text>
              <Text style={{ marginTop: 25 }}>Claim URL (Tiplink)</Text>
              <Text style={{ fontWeight: 'bold', marginTop: 5 }}>{migrationLink}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  if(!isLoading && !account) {
    return (
      <View style={{ alignItems: 'center', width: '100vw', height: '100vh', backgroundColor: 'white', overflow: 'hidden' }}>
        <View style={{ maxWidth: 500, width: '100%', height: '100%', borderLeftWidth: 1, borderRightWidth: 1, shadowColor: 'black', shadowRadius: 15 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: "center", backgroundColor: 'white', maxWidth: 500 }}>
            <Image
              source={logo}
              style={{ width: 250, height: 250, marginBottom: 30 }}
            />
            <TextInput
              value={inputAccount}
              keyboardType="default"
              onChange={({target}) => {
                // must use as any if not it will throw error
                setInputAccount((target as any).value);
              }}
              placeholder="Username"
              style={{ width: '80%', borderWidth: 2, height: 40, borderRadius: 5, marginBottom: 10, paddingHorizontal: 15 }}
            />
            <View style={{ width: '80%'}}>
              <Button onPress={login} title="Login"/>
            </View>
          </View>
        </View>
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
          isPublicKey,
          migrationLink,
          inputAccount,
          getData,
        }}>
          <View style={{ alignItems: 'center', width: '100vw', height: '100vh', backgroundColor: 'white', overflow: 'hidden' }}>
            <View style={{ maxWidth: 500, width: '100%', height: '100%', borderLeftWidth: 1, borderRightWidth: 1, shadowColor: 'black', shadowRadius: 15 }}>
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
