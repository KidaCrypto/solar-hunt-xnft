import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Animated,
} from "react-native";
import {
  createStackNavigator,
  StackCardStyleInterpolator,
} from "@react-navigation/stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Screen } from "../components/Screen";
import { TokenRow } from "../components/TokenRow";
import { AddressContext } from "../App";

const town_bg = require('../../assets/bg_blur/town_bg.png');

type RootStackParamList = {
  ComingSoon: {};
};

const Stack = createStackNavigator<RootStackParamList>();

function ComingSoon({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ComingSoon">) {

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
          source={town_bg}
          style={{ height: '100%' }}
        />
      </View>
      <View style={{ height: '100vh', alignItems: 'center', justifyContent: 'center', }}>
        <View style={{paddingHorizontal: 30, paddingVertical: 10, backgroundColor: 'white', borderRadius: 10 }}>
            <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 30 }}>Coming Soon</Text>
        </View>
      </View>
    </Screen>
  );
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

export const ShopScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animationEnabled: true,
        cardStyleInterpolator: forSlide,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ComingSoon"
        component={ComingSoon}
        options={{ title: "Token List" }}
      />
    </Stack.Navigator>
  );
};
