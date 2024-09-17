import { Button, StyleSheet, View } from "react-native";
import RateApp, { AndroidMarket } from "react-native-rate-app";

export default function App() {
  const onPressRate = async () => {
    const result = await RateApp.requestReview().catch((err) =>
      console.log(err),
    );
    console.log("rate", result);
  };

  const onPressOpenStoreForReview = async () => {
    const result = await RateApp.openStoreForReview({
      iOSAppId: "389801252",
      androidPackageName: "com.instagram.android",
      androidMarket: AndroidMarket.GOOGLE,
    }).catch((err) => console.log(err));
    console.log("store listing", result);
  };

  return (
    <View style={styles.container}>
      <Button title={"Rate"} onPress={onPressRate} />
      <Button title={"Open Store Review"} onPress={onPressOpenStoreForReview} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
