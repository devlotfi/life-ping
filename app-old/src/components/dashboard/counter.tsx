import { useEffect, useState } from "react";
import Text from "../text";
import { GradientCard } from "./gradient-card";
import { formatTime } from "../../utils";
import { useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";

const DEADLINE_HOURS = 36;

function Countdown({ lastPing }: { lastPing: number }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [remaining, setRemaining] = useState<number | null>(null);
  const [expired, setExpired] = useState<boolean>(false);

  useEffect(() => {
    const deadline =
      new Date(lastPing).getTime() + DEADLINE_HOURS * 60 * 60 * 1000;

    const update = () => {
      const now = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        setExpired(true);
        setRemaining(0);
        return false;
      }

      setRemaining(diff);
      return true;
    };

    // Run immediately on mount
    if (!update()) return;

    const interval = setInterval(() => {
      const stillValid = update();
      if (!stillValid) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastPing]);

  if (expired) {
    return (
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: theme.colors.errorContainer,
        }}
      >
        {t("timerElapsed")}
      </Text>
    );
  }

  if (remaining === null) {
    return null;
  }

  return (
    <Text
      style={{ fontSize: 20, fontWeight: "bold", color: theme.colors.primary }}
    >
      {formatTime(remaining)}
    </Text>
  );
}

export default function Counter({ lastPing }: { lastPing: number }) {
  const { t } = useTranslation();

  return (
    <GradientCard>
      <Text style={{ fontSize: 15 }}>{t("alertCountdown")}</Text>
      <Countdown lastPing={lastPing}></Countdown>
    </GradientCard>
  );
}
