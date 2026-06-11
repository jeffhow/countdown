import { useState, useEffect } from "react";

const getCalendarDiff = (targetDate, now, interval) => {
  const t = new Date(targetDate);

  switch (interval) {
    case "years":
      const totalYears = t.getFullYear() - now.getFullYear();
      return totalYears < 0 ? 0 : totalYears;
    case "months":
      const totalMonths =
        (t.getFullYear() - now.getFullYear()) * 12 +
        (t.getMonth() - now.getMonth());
      return totalMonths < 0 ? 0 : totalMonths;
    default:
      return 0;
  }
};

const calcRemaining = (targetMs) => {
  return targetMs - Date.now();
};

const Counter = ({ targetTime, interval }) => {
  const targetMs = new Date(targetTime).getTime(); // milliseconds returned
  let refresh = 50; // debounced milliseconds
  
  // STATE
  const [remaining, setRemaining] = useState(() => calcRemaining(targetMs));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (remaining<0) {
      setRemaining(0);
      return;
    }

    const timer = setInterval(() => {
      setRemaining(calcRemaining(targetMs));
    }, refresh);
    return () => clearInterval(timer);
  }, [targetMs]);

  const now = new Date();
  
  if (!isMounted) {
    return <span>--</span>;
  }
  if (interval == "seconds") {
    return <span>{Math.floor(remaining / 1000).toLocaleString()}</span>;
  } else if (interval == "minutes") {
    return <span>{Math.floor(remaining / (1000 * 60)).toLocaleString()}</span>;
  } else if (interval == "hours") {
    return (
      <span>{Math.floor(remaining / (1000 * 60 * 60)).toLocaleString()}</span>
    );
  } else if (interval == "days") {
    return (
      <span>
        {Math.floor(remaining / (1000 * 60 * 60 * 24)).toLocaleString()}
      </span>
    );
  } else if (interval == "weeks") {
    return (
      <span>
        {Math.floor(remaining / (1000 * 60 * 60 * 24 * 7)).toLocaleString()}
      </span>
    );
  } else if (interval == "months") {
    return <span>{getCalendarDiff(targetTime, now, "months")}</span>;
  } else if (interval == "years") {
    return <span>{getCalendarDiff(targetTime, now, "years")}</span>;
  } else {
    // milliseconds
    return <span>{remaining.toLocaleString()}</span>;
  }
};

export default Counter;
