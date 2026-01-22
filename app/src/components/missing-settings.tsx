import { View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Text from "../components/text";
import { Card, useTheme } from "react-native-paper";

export default function MissingSettings() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Card
        mode="contained"
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 20,
          maxWidth: 300,
        }}
      >
        <Card.Content style={{ alignItems: "center", gap: 10 }}>
          <FontAwesomeIcon
            icon={faInfoCircle}
            color={theme.colors.primary}
            size={50}
          ></FontAwesomeIcon>
          <Text style={{ fontSize: 23, fontWeight: "bold" }}>
            Missing settings
          </Text>
          <Text style={{ fontSize: 15, textAlign: "center" }}>
            You must provide the api key and the base url in the settings
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}
