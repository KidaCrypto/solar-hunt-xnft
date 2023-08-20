// todo
// flatlist optimization

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  createStackNavigator,
  StackCardStyleInterpolator,
} from "@react-navigation/stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Screen } from "../components/Screen";
import { AddressContext } from "../App";
import { getBaseUrl, runIfFunction } from "../utils/common";
import axios from '../services/axios';

type RootStackParamList = {
  Migrate: {};
  Detail: { id: string };
};

const Stack = createStackNavigator<RootStackParamList>();

function Migrate({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Migrate">) {
    const [ isMigrating, setIsMigrating ] = useState(false);
    const addressContext = useContext(AddressContext);

    const migrate = useCallback(async() => {
        if(addressContext.isPublicKey) {
            return;
        }

        setIsMigrating(true);
        try {
            await axios.post('/accountMigration/migrate', { account: addressContext.inputAccount });
            runIfFunction(addressContext.getData);
        }

        catch (e) {
            console.log('unable to migrate');
        }
        setIsMigrating(false);
    }, [ addressContext ]);

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
                source={{ uri: getBaseUrl() + '/assets/bg_blur/funfair_bg.jpg' }}
                style={{ height: '100%' }}
            />
            </View>
            <View style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                <View style={{ height: '80%', width: '90%', padding: '3%', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.8)' }}>
                    {
                            addressContext.isPublicKey?
                            <View style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{letterSpacing: 2, fontSize: 15, textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'center'}}>This Account cannot be migrated</Text>
                            </View>
                             :
                            <>
                            <Text style={{fontWeight: 'bold', fontSize: 25}}>Important</Text>
                            <Text style={{marginTop: 50, fontSize: 15, textAlign: 'center'}}>Only the Inventory, Gold, and EXP will be migrated.</Text>
                            <Text style={{marginTop: 15, fontSize: 15, textAlign: 'center'}}>Hunts will be lost after the migration.</Text>
                            <TouchableOpacity
                                onPress={migrate}
                                style={{width: '100%'}}
                                disabled={isMigrating || addressContext.isPublicKey}
                            >
                                <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: 'red', marginTop: 30, paddingVertical: 10, borderRadius: 5, borderWidth: 2}}>
                                    <Text style={{letterSpacing: 5, fontSize: 15, textTransform: 'uppercase', fontWeight: 'bold', color: 'white'}}>{isMigrating? 'Migrating' : 'Migrate'}</Text>
                                </View>
                            </TouchableOpacity>
                            </>
                    }
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

const styles = StyleSheet.create({
})

export const MigrateScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animationEnabled: true,
        cardStyleInterpolator: forSlide,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Migrate"
        component={Migrate}
        options={{ title: "Migrate" }}
      />
    </Stack.Navigator>
  );
};
