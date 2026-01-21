import { View } from "react-native";
import Text from "../text";
import { Button, Card, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";

function LanguageButton({
  name,
  language,
}: {
  name: string;
  language: string;
}) {
  const { i18n } = useTranslation();
  const theme = useTheme();

  return (
    <Button
      mode="contained"
      textColor={theme.colors.onBackground}
      contentStyle={{
        paddingVertical: 5,
        justifyContent: "flex-start",
      }}
      style={{
        backgroundColor: theme.colors.background,
      }}
      onPress={() => {
        i18n.changeLanguage(language);
      }}
    >
      <Text
        style={{
          color:
            i18n.language === language
              ? theme.colors.primary
              : theme.colors.onBackground,
          fontWeight: i18n.language === language ? "bold" : "medium",
        }}
      >
        {name}
      </Text>
    </Button>
  );
}

export default function LanguageCard() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Card
      mode="contained"
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
      }}
    >
      <Card.Content style={{ gap: 10 }}>
        <Text style={{ fontSize: 23, fontWeight: "bold" }}>
          {t("language")}
        </Text>
        <View style={{ gap: 5 }}>
          <LanguageButton name="العربية" language="ar"></LanguageButton>
          <LanguageButton name="Français" language="fr"></LanguageButton>
          <LanguageButton name="English" language="en"></LanguageButton>
        </View>
      </Card.Content>
    </Card>
  );
}
