import { Link, Stack } from "expo-router";
import { Text } from "react-native";

function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "counter",
          headerRight: () => (
            <Link href="/counter/history">
              <Text>H</Text>
            </Link>
          ),
        }}
      ></Stack.Screen>
    </Stack>
  );
}

export default Layout;
