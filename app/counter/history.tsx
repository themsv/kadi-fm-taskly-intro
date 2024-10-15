import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { countDownStorageKey, PersistedCountdownState } from ".";
import { getFromStorage } from "../../utils/storage";
import { format } from "date-fns";
import { theme } from "../../theme";

const fullDateFormat = `LLL d yyyy, h:mm aaa`;
function History() {
  const [countDown, setCountDown] = useState<PersistedCountdownState>();
  useEffect(() => {
    const initial = async () => {
      const value = await getFromStorage(countDownStorageKey);
      setCountDown(value);
    };
    initial();
  }, []);

  return (
    <FlatList
      data={countDown?.completedAt}
      contentContainerStyle={styles.contentContainer}
      style={styles.list}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text>{format(item, fullDateFormat)}</Text>
        </View>
      )}
    />
  );
}

export default History;

const styles = StyleSheet.create({
  list: {
    backgroundColor: theme.colorWhite,
    flex: 1,
  },
  contentContainer: {
    marginTop: 8,
  },
  listItem: {
    margin: 8,
    backgroundColor: theme.colorLightGray,
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
});
