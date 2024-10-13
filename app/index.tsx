import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";

type ShoppingListItemType = {
  id: string;
  name: string;
};

const initialList = [
  {
    id: "901",
    name: "Apple",
  },
  {
    id: "902",
    name: "Tea",
  },
  {
    id: "903",
    name: "Coffee",
  },
  {
    id: "904",
    name: "Bread",
  },
  {
    id: "905",
    name: "Milk",
  },
  {
    id: "906",
    name: "Eggs",
  },
  {
    id: "907",
    name: "Cheese",
  },
  {
    id: "908",
    name: "Pasta",
  },
  {
    id: "909",
    name: "Tomatoes",
  },
  {
    id: "910",
    name: "Chicken",
  },
  {
    id: "911",
    name: "Bananas",
  },
  {
    id: "912",
    name: "Yogurt",
  },
  {
    id: "913",
    name: "Cereal",
  },
  {
    id: "914",
    name: "Carrots",
  },
  {
    id: "915",
    name: "Potatoes",
  },
  {
    id: "916",
    name: "Onions",
  },
  {
    id: "1012",
    name: "Coconut Oil",
  },
  {
    id: "1013",
    name: "Almonds",
  },
];

export default function App() {
  const [shoppingList, setShoppingList] =
    useState<ShoppingListItemType[]>(initialList);
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    setShoppingList((prev) => [
      ...prev,
      {
        id: new Date().getTime().toString(),
        name: value,
      },
    ]);
    setValue("");
  };

  return (
    <FlatList
      style={styles.scrollView}
      data={shoppingList}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
      renderItem={({ item }) => (
        <ShoppingListItem key={item.id} name={item.name} />
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
