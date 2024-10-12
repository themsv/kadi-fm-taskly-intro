import { TouchableOpacity, View, Alert, StyleSheet, Text } from "react-native";
import { theme } from "../theme";

type Props = {
  name: string;
  isCompleted?: boolean;
};

export function ShoppingListItem({ name, isCompleted = false }: Props) {
  const handleDelete = () => {
    Alert.alert(
      `Are you sure you want to delete ${name}?`,
      "It will be gone for good",
      [
        {
          text: "Yes",
          onPress: () => console.log("Ok, deleting."),
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  return (
    <View style={[styles.itemContainer, isCompleted && styles.completedContainer]}>
      <Text style={[styles.itemText, isCompleted && styles.completedText]}>{name}</Text>
      <TouchableOpacity
        onPress={handleDelete}
        style={[styles.button, isCompleted && styles.completedButton]}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, isCompleted && styles.completedText]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomColor: theme.colorCerulean,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",    
  },
  itemText: {
    fontSize: 18,
    fontWeight: "200",
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  completedContainer:{
   backgroundColor: theme.colorLightGray,
   borderBottomColor: theme.colorLightGray,
  },
  completedText: {
    color: theme.colorGray,
    textDecorationLine: "line-through",
  },
  completedButton: {
    backgroundColor: theme.colorLightGray,
  },
});
