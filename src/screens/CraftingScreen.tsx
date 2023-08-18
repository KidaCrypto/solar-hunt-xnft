
import { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Button,
  TouchableHighlight,
} from "react-native";
import {
  createStackNavigator,
  StackCardStyleInterpolator,
} from "@react-navigation/stack";

import { Screen } from "../components/Screen";
import { SignMessageButton } from "../components/SignMessageButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Craftable, getCraftables } from "../helpers/api";
import { getBaseUrl, toLocaleDecimal } from "../utils/common";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AddressContext } from "../App";

const volcano_bg = require('../../assets/bg_blur/volcano_bg.png');
const forge_bg = require('../../assets/bg_blur/forge_bg.jpg');

export type PreCraftParams = {
  craftable_id: number;
  nft_ids: string[];
  account: string;
  isPublicKey: boolean;
}

export type NewCraftParams = {
  uuid: string;
}

type RootStackParamList = {
  List: {};
  Detail: { craftable: Craftable };
};

const Stack = createStackNavigator<RootStackParamList>();

const CraftableItem = ({ item, onPress }: {item: Craftable, onPress: (craftable: Craftable) => void}) => {
  let skills: { [name: string]: number } = {};
  item.skills!.forEach(skill => {
    // format increase_x_rate
    let name = skill.name.split("_")[1];
    if(!skills[name]) {
      skills[name] = 0;
    }

    skills[name] += skill.value;
  });

  let skillText = Object.entries(skills).map(([key, value]) => (`${key.charAt(0).toUpperCase()}${key.substring(1, key.length)} +${toLocaleDecimal(value, 2, 2)}%\n`));

  return (
    <TouchableHighlight 
      onPress={() => onPress(item)} 
      style={{
        marginBottom: 20
      }}
    >
      <View style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <View  >
          <Image 
            source={{ uri: getBaseUrl() + "/assets/skills/" + item.img_file }}
            style={{
              height: 80,
              width: 80,
              borderRadius: 5, 
              borderColor: 'white', 
              borderWidth: 2,
            }}
          />
        </View>
        <View style={{
          borderTopRightRadius: 5,
          borderBottomRightRadius: 5,
          borderColor: 'black',
          borderWidth: 2,
          borderLeftWidth: 0,
          backgroundColor: 'white',
          height: '80%',
          width: '72vw',
          padding: 5,
        }}>
          <Text style={{ fontWeight: '600', fontSize: 12 }}>{item.name}</Text>
          <Text style={{ fontSize: 10, marginTop: 5 }}>{skillText}</Text>
        </View>
      </View>
    </TouchableHighlight>
  )
}

function List({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "List">) {

  const [ craftables, setCraftables ] = useState<Craftable[]>([]);
  const [ isLoading, setIsLoading ] = useState(true);

  // get craftables
  useEffect(() => {
    const getData = async() => {
      let res = await getCraftables();

      setTimeout(() => {
        setIsLoading(false);
      }, 500);

      if(typeof res === "string") {
        return;
      }

      setCraftables(res);
    }

    getData();
  }, []);

  return (
    <Screen>
      <View style={{
        position: 'absolute',
        top: -10,
        left: 0,
        right: 0,
        height: 'calc(100vh + 20px)',
      }}>
        <Image
          source={volcano_bg}
          style={{ height: '100%' }}
        />
      </View>
      <View>
        <Text style={styles.title}>CRAFTS</Text>
      </View>
      {
        isLoading? 
        <View style={{ 
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          alignItems: 'center', 
          justifyContent: 'center',
        }}>
          <ActivityIndicator color="white" size={"large"}/>
        </View> :
        <FlatList
          style={styles.flatlist}
          data={craftables}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CraftableItem item={item} onPress={() => navigation.push('Detail', { craftable: item })}/>
          )}
        />
      }
    </Screen>
  );
}
function Detail({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "Detail">) {
  
  const [ hasRequired, setHasRequired ] = useState(false);
  const { craftable } = route.params;
  const addressContext = useContext(AddressContext);

  useEffect(() => {
    craftable.requirements!.forEach(x => {
      let addressOwned = addressContext.loots.filter(a => a.metadata.name === x.loot![0].name).length;
      if(addressOwned >= x.value) {
        return;
      }
      setHasRequired(false);
      return;
    })
  }, [addressContext, craftable]);

  return (
    <Screen>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100vh',
      }}>
        <Image
          source={forge_bg}
          style={{ height: '100%' }}
        />
      </View>
      <View style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1,
      }}>
        <TouchableHighlight
          onPress={() => navigation.pop()}
        >
          <View style={{ height: 50, width: 50 }}>
            <MaterialCommunityIcons name="chevron-left" color="white" size={50}/>
          </View>
        </TouchableHighlight>
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
          <Image 
            source={{ uri: getBaseUrl() + "/assets/skills/" + craftable.img_file }}
            style={{
              height: 165,
              width: 165,
              borderRadius: 5, 
              borderColor: 'white', 
              borderWidth: 2,
            }}
          />
          <View
            style={{ 
              marginTop: 20, 
              backgroundColor: 'rgba(255,255,255, 0.5)', 
              height: '55%', 
              width: '90%',
              justifyContent: 'space-between',
              padding: 10,
              alignItems: 'center',
              borderRadius: 5,
              shadowColor: 'black',
              shadowRadius: 15,
            }}
          >
            <Text style={{ letterSpacing: 5 }}>REQUIREMENTS</Text>
            <View style={{ 
              flex: 1,
              alignItems: 'center', 
              justifyContent: 'center',
              marginTop: 5,
              marginBottom: 5,
            }}>
                {
                  craftable.requirements!.map(x => {
                    let addressOwned = addressContext.loots.filter(a => a.metadata.name === x.loot![0].name).length;

                    return (
                    <View key={`requirement_${x.loot_id}`} style={{ flexDirection: 'row', marginTop: 10 }}>
                      <Image
                        source={{uri: getBaseUrl() + "/assets/skills/" + x.loot![0].img_file}}
                        style={{
                          height: 50,
                          width: 50,
                        }}
                      />
                      <View style={{ marginLeft: 5, paddingLeft: 15, width: 150, alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={{ marginLeft: 5 }}>{x.loot![0].name}: <Text style={{ color: addressOwned < x.value? '#e22f2f' : '#64e73c'}}>{addressOwned} </Text>/ {x.value}</Text>
                      </View>
                    </View>
                    )
                  })
                }
            </View>
            <TouchableHighlight
              disabled={!hasRequired}
            >
              <View style={{ 
                height: 50, 
                width: 50, 
                borderRadius: 25, 
                backgroundColor: 'white', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <MaterialCommunityIcons name="hammer" size={30} color={hasRequired? "black" : 'gray'}/>
              </View>
            </TouchableHighlight>
          </View>
      </View>
    </Screen>
  )
}

const forSlide: StackCardStyleInterpolator = ({
  current,
  next,
  inverted,
  layouts: { screen },
}) => {
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: "clamp",
        })
      : 0,
  );

  return {
    cardStyle: {
      transform: [
        {
          translateX: Animated.multiply(
            progress.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [
                screen.width, // Focused, but offscreen in the beginning
                0, // Fully focused
                screen.width * -0.3, // Fully unfocused
              ],
              extrapolate: "clamp",
            }),
            inverted,
          ),
        },
      ],
    },
  };
};

const styles = StyleSheet.create({
  flatlist: { 
    flex: 1, 
    maxHeight: '100vh',
    marginTop: 30,
    paddingBottom: 200,
  },
  title: { 
    letterSpacing: 5, 
    marginTop: 15, 
    marginRight: 20, 
    color: "#fffffa",
    fontWeight: 'bold',
    fontSize: 30,
  },
})

export const CraftingScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animationEnabled: true,
        cardStyleInterpolator: forSlide,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="List"
        component={List}
        options={{ title: "Crafting List" }}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{ title: "Crafting Detail" }}
      />
    </Stack.Navigator>
  );
};
