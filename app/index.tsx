import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
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
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Eat"
        value={value}
        onChangeText={setValue}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      {shoppingList.map((item) => (
        <ShoppingListItem key={item.id} name={item.name} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  textInput: {
    borderRadius: 15,
    borderColor: theme.colorCerulean,
    borderWidth: 2,
    padding: 12,
    margin: 12,
  },
});
