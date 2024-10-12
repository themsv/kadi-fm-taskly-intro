import { StyleSheet, View } from "react-native";
import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { Link } from "expo-router";

export default function App() {
  return (
    <View style={styles.container}>
      <Link href="/counter" style={{ textAlign: "center", fontSize: 24 }}>
        Go to /counter
      </Link>
      <ShoppingListItem name="Coffee" isCompleted />
      <ShoppingListItem name="Bread" />
      <ShoppingListItem name="Milk" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    justifyContent: "center",
  },
});
