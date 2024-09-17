import { StyleSheet, View, Button } from "react-native";
import RateApp from "react-native-rate-app";

export default function App() {
  const onPressRate = async () => {
    const result = await RateApp.requestReview();
    console.log("rate", result);
  };

  const onPressStoreListing = async () => {
    const result = await RateApp.openStoreListing({ appId: "1656484083" });
    console.log("store listing", result);
  };

  return (
    <View style={styles.container}>
      <Button title={"Rate"} onPress={onPressRate} />
      <Button title={"OpenStore Listing"} onPress={onPressStoreListing} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
