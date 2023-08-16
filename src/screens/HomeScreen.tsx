import { Text, FlatList, Image } from "react-native";

import { Screen } from "../components/Screen";
import { useContext } from "react";
import { MetadataContext, AddressContext } from "../App";
import { convertToHumanReadable } from "../utils/common";
import { Button, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { newHunt } from "../helpers/hunt";

const forest_bg = require('../../assets/bg_blur/grasslands_bg.png');

export function HomeScreen() {
  const addressContext = useContext(AddressContext);
  const metadataContext = useContext(MetadataContext);

  console.log(addressContext.history)
  return (
    <Screen>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
        <Image
          source={forest_bg}
          style={{ height: '100%' }}
        />
      </View>
      <View style={{ marginBottom: 20 }}>
        <View style={{
          height: 70,
          width: 70,
          borderRadius: 50,
          backgroundColor: 'orange',
          borderColor: 'black',
          borderWidth: 1,
          zIndex: 2,
        }}>
          {/** Badge here */}
        </View>
            <View style={{
              position: 'absolute',
              top: 18,
              height: 15,
              left: 35,
              width: 150,
              borderRadius: 3,
              backgroundColor: 'white',
              borderColor: 'black',
              borderWidth: 1,
              paddingLeft: 40,
              zIndex: 1,
              alignItems: 'flex-start',
              justifyContent: 'center'
            }}>
              <Text style={{ fontSize: 10 }}>900 Gold</Text>
            </View>
            <View style={{
              position: 'absolute',
              top: 32,
              height: 15,
              left: 25,
              width: 150,
              borderRadius: 3,
              backgroundColor: 'white',
              borderColor: 'black',
              borderWidth: 1,
              paddingLeft: 50,
              zIndex: 1,
              alignItems: 'flex-start',
              justifyContent: 'center'
            }}>
              <Text style={{ fontSize: 10 }}>
                900 EXP
              </Text>
              {/** Progress bar here */}
            </View>
      </View>
      <View style={{
        flex: 1,
        minHeight: '90%',
        overflow: 'hidden',
        backgroundColor: '#fffef0',
      }}>
        {/** Inner shadows */}
        <View 
          style={{
            position: 'absolute',
            top: -5,
            left: 0,
            right: 0,
            shadowColor: '#8a4d0f',
            shadowRadius: 15,
            shadowOpacity: 1,
            height: 5,
            backgroundColor: '#fffef0',
          }}
        >
        </View>
        <View 
          style={{
            position: 'absolute',
            bottom: -5,
            left: 0,
            right: 0,
            shadowColor: '#8a4d0f',
            shadowRadius: 15,
            shadowOpacity: 1,
            height: 5,
            backgroundColor: '#fffef0',
          }}
        >
        </View>
        <View 
          style={{
            position: 'absolute',
            top: 0,
            left: -5,
            bottom: 0,
            shadowColor: '#8a4d0f',
            shadowRadius: 15,
            shadowOpacity: 1,
            width: 5,
            backgroundColor: '#fffef0',
          }}
        >
        </View>
        <View 
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: -5,
            shadowColor: '#8a4d0f',
            shadowRadius: 10,
            shadowOpacity: 1,
            width: 5,
            backgroundColor: '#fffef0',
          }}
        >
        </View>
        {/** Hunting log here */}
        <Image
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          source={{uri: "data:image/png;base64,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"}}
        />
        
        <View style={{ 
          padding: 10,
          margin: 20,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 5,
          shadowColor: 'black',
          shadowRadius: 3,
         }}>
          <TouchableOpacity 
            onPress={() => newHunt({ account: addressContext.account, isPublicKey: true })}
            accessibilityRole="button"
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="sword-cross" color='black' size={20} />
              <Text style={{ letterSpacing: 5, marginLeft: 25, marginRight: 20 }}>HUNT</Text>
              <MaterialCommunityIcons name="sword-cross" color='black' size={20} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={addressContext.history}
        keyExtractor={(item) => `hunt_${item.id}`}
        renderItem={({ item }) => <Text>{convertToHumanReadable(item.created_at)}</Text>}
      />
    </Screen>
  );
}
