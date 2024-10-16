import { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from "react-native";
import * as Notifications from "expo-notifications";
import { isDevice } from "expo-device";
import { Duration, intervalToDuration, isBefore } from "date-fns";
import ConfettiCannon from "react-native-confetti-cannon";
import * as Haptics from "expo-haptics";

import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import { theme } from "../../theme";
import { TimeSegment } from "../../components/TimeSegment";
import { getFromStorage, saveToStorage } from "../../utils/storage";

type CountDownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

export type PersistedCountdownState = {
  currentNoficationId: string | undefined;
  completedAt: number[];
};

const FREQUENCY = 10 * 1000;
export const countDownStorageKey = "taskly-countdown";

export default function CounterScreen() {
  const [status, setStatus] = useState<CountDownStatus>({
    isOverdue: false,
    distance: {},
  });
  const confettiRef = useRef<any>();
  const [countDown, setCountDown] = useState<PersistedCountdownState>();

  const { width } = useWindowDimensions();

  const handleRequestPermission = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    confettiRef?.current?.start();
    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Plantly! Running out of Time",
        },
        trigger: {
          seconds: FREQUENCY / 1000,
        },
      });
    } else {
      if (isDevice) {
        Alert.alert(
          "Needs Permissions",
          "Enable permission for notification for ExpoGo app in settings"
        );
      }
    }

    if (countDown?.currentNoficationId) {
      await Notifications.cancelScheduledNotificationAsync(
        countDown.currentNoficationId
      );
    }

    const newCountDownState: PersistedCountdownState = {
      currentNoficationId: pushNotificationId,
      completedAt: countDown?.completedAt
        ? [Date.now(), ...countDown.completedAt]
        : [Date.now()],
    };
    setCountDown(newCountDownState);
    await saveToStorage(countDownStorageKey, newCountDownState);
  };

  useEffect(() => {
    const initial = async () => {
      const value = await getFromStorage(countDownStorageKey);
      setCountDown(value);
    };
    initial();
  }, []);

  const lastCompletedAt = countDown?.completedAt[0];

  useEffect(() => {
    const id = setInterval(() => {
      const timeStamp = lastCompletedAt
        ? lastCompletedAt + FREQUENCY
        : Date.now();
      const isOverdue = isBefore(timeStamp, Date.now());
      const distance = intervalToDuration(
        isOverdue
          ? { end: Date.now(), start: timeStamp }
          : {
              end: timeStamp,
              start: Date.now(),
            }
      );
      setStatus({
        isOverdue,
        distance,
      });
    }, 1000);

    return () => clearInterval(id);
  }, [lastCompletedAt]);
  return (
    <View
      style={[
        styles.container,
        status.isOverdue ? styles.containerLate : undefined,
      ]}
    >
      <Text
        style={[
          styles.heading,
          status.isOverdue ? styles.textWhite : undefined,
        ]}
      >
        {status.isOverdue ? "Running Out of Time" : "Lets make it quick"}
      </Text>
      <View style={styles.row}>
        <TimeSegment unit="days" number={status.distance.days ?? 0} />
        <TimeSegment unit="hours" number={status.distance.hours ?? 0} />
        <TimeSegment unit="minutes" number={status.distance.minutes ?? 0} />
        <TimeSegment unit="seconds" number={status.distance.seconds ?? 0} />
      </View>
      <TouchableOpacity
        onPress={handleRequestPermission}
        activeOpacity={0.2}
        style={styles.button}
      >
        <Text style={styles.buttonText}>I have done thing</Text>
      </TouchableOpacity>
      <ConfettiCannon
        ref={confettiRef}
        origin={{ x: width / 2, y: 0 }}
        count={50}
        fadeOut={true}
        autoStart={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorWhite,
  },
  containerLate: {
    backgroundColor: theme.colorRed,
  },
  row: {
    flexDirection: "row",
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: theme.colorBlack,
  },
  textWhite: {
    color: theme.colorWhite,
  },
});
