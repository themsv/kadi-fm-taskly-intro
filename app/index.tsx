import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";

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
    setShoppingList((prev) => [
      ...prev,
      {
        id: new Date().getTime().toString(),
        name: value,
        lastUpdateAt: Date.now(),
      },
    ]);
    setValue("");
  };

  const handleOnDelete = (id: string) => {
    const newList = shoppingList.filter((_) => _.id !== id);
    setShoppingList(newList);
  };

  const handleToggleComplete = (id: string) => {
    const newList = shoppingList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          lastUpdateAt: Date.now(),
          completedAt: item.completedAt ? "" : Date.now(),
        };
      }
      return item;
    });
    setShoppingList(newList);
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
