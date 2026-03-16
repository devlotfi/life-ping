import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

export default function ErrorView() {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
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
            icon={faTriangleExclamation}
            color={theme.colors.primary}
            size={50}
          ></FontAwesomeIcon>
          <Text style={{ fontSize: 23, fontWeight: "bold" }}>
            Cannot fetch data
          </Text>
          <Text style={{ fontSize: 15, textAlign: "center" }}>
            Could not retrieve data from the API, check your API key and URL
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}
