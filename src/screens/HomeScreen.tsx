import { Text, FlatList, Image } from "react-native";

import { Screen } from "../components/Screen";
import { useContext } from "react";
import { MetadataContext, AddressContext } from "../App";
import { convertToHumanReadable, getBaseUrl } from "../utils/common";
import { Button, View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Hunt, newHunt } from "../helpers/api";
import { LinearGradient } from "expo-linear-gradient";

const forest_bg = require('../../assets/bg_blur/grasslands_bg.png');

const LootText = ({ item }: { item: Hunt }) => {
  let hasLoot = item.hunt_loots.length > 0;

  if(!hasLoot) {
    return null;
  }

  return (<Text>
    {" Furthermore, the monster dropped "}
    {
      item.hunt_loots.map((loot, index) => {
        let prepend = ",";
        if(index === 0) {
          prepend = "";
        }
  
        else if(index > 2 && index === item.hunt_loots.length - 1) {
          prepend = ", and "
        }
  
        else if(index === item.hunt_loots.length - 1) {
          prepend = " and "
        }

        return <Text key={`loot_text_${item.id}_${index}`}>{prepend}<Text style={{fontWeight: 'bold'}}>1x {loot.loot![0].name}</Text></Text>;
      })
    }
    {"."}
  </Text>)
    
}

export function HomeScreen() {
  const addressContext = useContext(AddressContext);
  const metadataContext = useContext(MetadataContext);

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
            <View style={[styles.playerTokens, { left: 35, top: 18 }]}>
              {/** diagonal shape */}
              <View style={styles.triangleCorner} />
              <View style={styles.triangleCornerInner} />
              <Text style={{ fontSize: 10 }}>{addressContext.tokens.gold} Gold</Text>
            </View>
            <View style={[styles.playerTokens, { left: 15, top: 33, paddingLeft: 60 }]}>
              <View style={styles.triangleCorner} />
              <View style={styles.triangleCornerInner} />
              <Text style={{ fontSize: 10 }}>
                {addressContext.tokens.exp} EXP
              </Text>
              {/** Progress bar here */}
            </View>
      </View>
      <View style={{
        flex: 1,
        minHeight: '90%',
        overflow: 'hidden',
        backgroundColor: '#fffef0',
        padding: 20,
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
        
        <TouchableOpacity 
          onPress={() => newHunt({ account: addressContext.account, isPublicKey: true })}
          accessibilityRole="button"
        >
          <LinearGradient
            colors={['#ab875e', 'transparent', '#ab875e',]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ 
              width: '100%', 
              height: '100%', 
              flexDirection: 'row', 
              alignItems: 'center',
              borderRadius: 5,
            }}
          >
            <View style={{ 
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              shadowColor: 'black',
              shadowRadius: 3,
              flex: 1,
            }}>
                <MaterialCommunityIcons name="sword-cross" color='#4d4235' size={20} />
                <Text style={{ letterSpacing: 5, marginLeft: 25, marginRight: 20, color: "#4d4235" }}>HUNT</Text>
                <MaterialCommunityIcons name="sword-cross" color='#4d4235' size={20} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
        
        {
          addressContext.history.length === 0?
          <View style={{ marginTop: 10, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontWeight: 'bold', marginBottom: 10}}>↑↑↑</Text>
            <Text style={{fontWeight: 'bold'}}>Click the Hunt Button to start a Hunt!</Text>
          </View>
           :
          null
        }

        <FlatList
          style={{ marginTop: 20, paddingTop: 30, paddingBottom: 100 }}
          data={addressContext.history}
          keyExtractor={(item) => `hunt_${item.id}`}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            
            return (<View style={{
              marginBottom: 35,
              width: '100%',
            }}>
              <Text style={{ fontSize: 8 }}>{convertToHumanReadable(item.created_at)}</Text>
              <View style={{
                flexDirection: index % 2 === 1? 'row' : 'row-reverse',
                alignItems: 'center',
                marginTop: 5,
                paddingVertical: 10,
              }}>
                <Text style={{ fontSize: 11 }}>Encountered <Text style={{fontWeight: 'bold'}}>{item.is_shiny? '*' : ''}{item.monster.name}{item.is_shiny? '*' : ''}</Text> worth <Text style={{fontWeight: 'bold'}}>{item.gold}</Text> gold and <Text style={{fontWeight: 'bold'}}>{item.exp}</Text> exp {item.caught? ', after a gruesome fight, it was felled.' : 'but alas, it escaped our grasp.'}<LootText item={item}/></Text>
                <Image
                  source={{ uri: `${getBaseUrl()}/assets/sprites/base${item.is_shiny? '_shiny' : ''}/${item.monster.img_file}` }}
                  style={{ height: 50, width: 50, marginLeft: index % 2 === 1? 10 : 0, marginRight: index % 2 === 1? 0 : 10,  }}
                />
              </View>
            </View>)
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  playerTokens: {
    position: 'absolute',
    height: 15,
    width: 165,
    borderRadius: 3,
    // borderColor: 'black',
    // borderWidth: 1,
    paddingLeft: 40,
    zIndex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  triangleCorner: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 15,
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderTopColor: 'gray',
    zIndex: -2
  },
  triangleCornerInner: {
    position: 'absolute',
    top: 1,
    bottom: 1,
    left: 1,
    right: 1,
    borderTopWidth: 14,
    borderRightWidth: 9,
    borderRightColor: 'transparent',
    borderTopColor: 'white',
    zIndex: -2
  }
});