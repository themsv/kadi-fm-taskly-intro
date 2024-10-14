import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  LayoutAnimation,
} from "react-native";
import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { getFromStorage, saveToStorage } from "../utils/storage";
import * as Haptics from "expo-haptics";
//System Haptics setting should be on on IOS

const APP_STORAGE_KEY = "SHOPPING_LIST";

type ShoppingListItemType = {
  id: string;
  name: string;
  completedAt?: number;
  lastUpdateAt: number;
};

export default function App() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShoppingList((prev) => [
      ...prev,
      {
        id: new Date().getTime().toString(),
        name: value,
        lastUpdateAt: Date.now(),
      },
    ]);
    setValue("");
    saveToStorage(APP_STORAGE_KEY, shoppingList);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleOnDelete = (id: string) => {
    const newList = shoppingList.filter((_) => _.id !== id);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShoppingList(newList);
    saveToStorage(APP_STORAGE_KEY, newList);
  };

  const handleToggleComplete = (id: string) => {
    const newList = shoppingList.map((item) => {
      if (item.id === id) {
        if (item.completedAt)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        else
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return {
          ...item,
          lastUpdateAt: Date.now(),
          completedAt: item.completedAt ? undefined : Date.now(),
        };
      }
      return item;
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShoppingList(newList);
    saveToStorage(APP_STORAGE_KEY, newList);
  };
  function orderShoppingList(shoppingList: ShoppingListItemType[]) {
    return shoppingList.sort((item1, item2) => {
      if (item1.completedAt && item2.completedAt) {
        return item2.completedAt - item1.completedAt;
      }

      if (item1.completedAt && !item2.completedAt) {
        return 1;
      }

      if (!item1.completedAt && item2.completedAt) {
        return -1;
      }

      if (!item1.completedAt && !item2.completedAt) {
        return item2.lastUpdateAt - item1.lastUpdateAt;
      }

      return 0;
    });
  }

  useEffect(() => {
    const getInitialList = async () => {
      const list = await getFromStorage(APP_STORAGE_KEY);
      if (list) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShoppingList(list);
      }
    };
    getInitialList();
  }, []);

  return (
    <FlatList
      style={styles.scrollView}
      data={orderShoppingList(shoppingList)}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
      renderItem={({ item }) => (
        <ShoppingListItem
          key={item.id}
          name={item.name}
          onDelete={() => handleOnDelete(item.id)}
          onToggleComplete={() => handleToggleComplete(item.id)}
          isCompleted={Boolean(item.completedAt)}
        />
      )}
      ListEmptyComponent={
        <View style={{ alignItems: "center" }}>
          <Text>Found Nothing</Text>
        </View>
      }
      ListHeaderComponent={
        <TextInput
          style={styles.textInput}
          placeholder="Add item"
          value={value}
          onChangeText={setValue}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
      }
    ></FlatList>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  textInput: {
    borderRadius: 15,
    borderColor: theme.colorCerulean,
    borderWidth: 2,
    padding: 12,
    marginBottom: 12,
    backgroundColor: theme.colorWhite,
  },
});
