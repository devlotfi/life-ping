import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatTime } from "../utils/format-time";
import { Card } from "@heroui/react";

const DEADLINE_HOURS = 48;

function Countdown({ lastPing }: { lastPing: number }) {
  const { t } = useTranslation();
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
    return <div className="text-danger">{t("timerElapsed")}</div>;
  }

  if (remaining === null) {
    return null;
  }

  return (
    <div className="flex font-bold text-accent">{formatTime(remaining)}</div>
  );
}

export default function Counter({ lastPing }: { lastPing: number }) {
  const { t } = useTranslation();

  return (
    <Card>
      <Card.Content>
        <div className="flex">{t("alertCountdown")}</div>
        <Countdown lastPing={lastPing}></Countdown>
      </Card.Content>
    </Card>
  );
}
