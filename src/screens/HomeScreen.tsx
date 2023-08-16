import { Text, FlatList } from "react-native";
import tw from "twrnc";

import { Screen } from "../components/Screen";
import { useContext } from "react";
import { MetadataContext, AddressContext } from "../App";
import { convertToHumanReadable } from "../utils/common";
import { Button, View, TouchableWithoutFeedback } from 'react-native';
import { newHunt } from "../helpers/hunt";

export function HomeScreen() {
  const addressContext = useContext(AddressContext);
  const metadataContext = useContext(MetadataContext);

  return (
    <Screen>
      <FlatList
        data={addressContext.history}
        keyExtractor={(item) => `hunt_${item.id}`}
        renderItem={({ item }) => <Text>{convertToHumanReadable(item.created_at)}</Text>}
      />
      <View style={{ position: 'absolute', top: 100, left: 10, right: 10 }}>
        <TouchableWithoutFeedback 
          onPress={() => newHunt({ account: addressContext.account, isPublicKey: true })}
        >
          <Text>New Hunt</Text>
        </TouchableWithoutFeedback>
      </View>
    </Screen>
  );
}
