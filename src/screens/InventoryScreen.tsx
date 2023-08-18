// todo
// flatlist optimization

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
} from "react-native";
import {
  createStackNavigator,
  StackCardStyleInterpolator,
} from "@react-navigation/stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Screen } from "../components/Screen";
import { AddressContext } from "../App";
import { getBaseUrl } from "../utils/common";

const sky_bg = require('../../assets/bg_blur/sky_bg.png');

type RootStackParamList = {
  List: {};
  Detail: { id: string };
};

type TokenDetail = { 
  count: number; 
  uri: string; 
};

const Stack = createStackNavigator<RootStackParamList>();

const TokenIcon = ({ item }: {item: TokenDetail}) => {
  return (
    <View style={styles.tokenIcon}>
      <View style={styles.tokenCountContainer}>
        <Text style={styles.tokenCount}>{ item.count }</Text>
      </View>
      <Image
        source={{ uri: item.uri }}
        style={{ height: 50, width: 50 }}
      />
    </View>
  )
}

const SkillIcon = ({ item }: {item: TokenDetail}) => {
  return (
    <View style={styles.skillIcon}>
      <View style={styles.skillCountContainer}>
        <Text style={styles.skillCount}>{ item.count }</Text>
      </View>
      <Image
        source={{ uri: item.uri }}
        style={{ height: 60, width: 60 }}
      />
    </View>
  )
}

function List({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "List">) {
  const addressContext = useContext(AddressContext);
  
  const monsters = useMemo(() => {
    let ret: { [name: string]: TokenDetail } = {};

    // do some refining
    for(const item of addressContext.monsters) {
        let name = item.metadata.name;
        let uri = item.metadata.image.replace("https://solar-hunt.kidas.app", getBaseUrl());
        if(!ret[name]) {
          ret[name] = {
            count: 0,
            uri,
          };
        }

        ret[name].count++;
    }
    return ret;
  }, [ addressContext.monsters ]);

  const loots = useMemo(() => {
    let ret: { [name: string]: TokenDetail } = {};

    // do some refining
    for(const item of addressContext.loots) {
        let name = item.metadata.name;
        let uri = item.metadata.image.replace("https://solar-hunt.kidas.app", getBaseUrl());
        if(!ret[name]) {
          ret[name] = {
            count: 0,
            uri,
          };
        }

        ret[name].count++;
    }
    return ret;
  }, [ addressContext.loots ]);

  const craftables = useMemo(() => {
    let ret: { [name: string]: TokenDetail } = {};

    // do some refining
    for(const item of addressContext.craftables) {
        let name = item.metadata.name;
        let uri = item.metadata.image.replace("https://solar-hunt.kidas.app", getBaseUrl());
        if(!ret[name]) {
          ret[name] = {
            count: 0,
            uri,
          };
        }

        ret[name].count++;
    }
    return ret;
  }, [ addressContext.craftables ]);

  return (
    <Screen>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100vh',
        zIndex: -1,
      }}>
        <Image
          source={sky_bg}
          style={{ height: '100%' }}
        />
      </View>
      <ScrollView
        scrollEnabled={true}
        style={{ maxHeight: '100vh', paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { fontSize: 30, color: 'white' }]}>INVENTORY</Text>

        {/* monsters */}
        <Text style={styles.title}>MONSTERS</Text>
        <FlatList
          numColumns={5}
          style={styles.flatlist}
          data={Object.keys(monsters)}
          keyExtractor={(item, index) => index.toString() + '_monster'}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return <TokenIcon item={monsters[item]}/>;
          }}
        />
        {/* loots */}
        <Text style={[styles.title, { marginTop: 30 }]}>LOOTS</Text>
        <FlatList
          numColumns={5}
          style={styles.flatlist}
          data={Object.keys(loots)}
          keyExtractor={(item, index) => index.toString() + '_loots'}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return <SkillIcon item={loots[item]}/>;
          }}
        />
        {/* craftables */}
        <Text style={[styles.title, { marginTop: 30 }]}>CRAFTS</Text>
        <FlatList
          numColumns={5}
          style={styles.flatlist}
          data={Object.keys(craftables)}
          keyExtractor={(item, index) => index.toString() + '_crafts'}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return <SkillIcon item={craftables[item]}/>;
          }}
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}
        />
      </ScrollView>
    </Screen>
  );
}

function Detail({
  route,
}: NativeStackScreenProps<RootStackParamList, "Detail">) {
  return null
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
    borderWidth: 3, 
    borderRadius: 10, 
    marginTop: 10, 
    minHeight: '40vh',
    backgroundColor: 'white',
    paddingBottom: '1.6%',
  },
  title: { 
    letterSpacing: 5, 
    marginTop: 15, 
    marginRight: 20, 
    color: "#4d4235",
    fontWeight: 'bold',
  },
  tokenIcon: {
    width: '18%',
    aspectRatio: 1,
    marginTop: '1.6%',
    marginLeft: '1.6%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    overflow: 'hidden',
  },
  tokenCountContainer: {
    position: 'absolute',
    right: 1,
    top: 1,
    height: 15,
    width: 15,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  tokenCount: {
    fontWeight: 'bold',
    fontSize: 10,
    color: 'black',
  },
  skillIcon: {
    position: 'relative',
    width: '18%',
    aspectRatio: 1,
    marginTop: '1.6%',
    marginLeft: '1.6%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    // backgroundColor: 'rgba(0,0,0,0.3)'
    overflow: 'hidden',
  },
  skillCountContainer: {
    position: 'absolute',
    right: 1,
    top: 1,
    height: 15,
    width: 15,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  skillCount: {
    fontWeight: 'bold',
    fontSize: 10,
    color: 'black',
  },
})

export const InventoryScreen = () => {
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
        options={{ title: "Token List" }}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{ title: "Token Detail" }}
      />
    </Stack.Navigator>
  );
};
