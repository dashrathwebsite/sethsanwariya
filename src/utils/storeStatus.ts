/**
 * Real-time Indian Standard Time (Asia/Kolkata) store status calculator
 */

export interface StoreStatusResult {
  isOpen: boolean;
  statusTextHi: string;
  subTextHi: string;
  currentTimeIst: string;
}

export function getStoreStatus(
  openingTime = "08:00",
  closingTime = "22:00",
  isExceptionalClosure = false,
  exceptionalClosureReason?: string
): StoreStatusResult {
  if (isExceptionalClosure) {
    return {
      isOpen: false,
      statusTextHi: "आज दुकान विशेष रूप से बंद है",
      subTextHi: exceptionalClosureReason || "विशेष अवकाश के कारण दुकान बंद है।",
      currentTimeIst: getCurrentIstTimeString()
    };
  }

  try {
    // Current date and time in Asia/Kolkata
    const now = new Date();
    const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const istDate = new Date(istString);

    const currentMinutes = istDate.getHours() * 60 + istDate.getMinutes();

    const [openH, openM] = openingTime.split(":").map(Number);
    const [closeH, closeM] = closingTime.split(":").map(Number);

    const openMinutes = openH * 60 + (openM || 0);
    const closeMinutes = closeH * 60 + (closeM || 0);

    const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

    const timeFormatter = new Intl.DateTimeFormat("hi-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
    const formattedCurrentTime = timeFormatter.format(now);

    return {
      isOpen,
      statusTextHi: isOpen ? "अभी दुकान खुली है" : "अभी दुकान बंद है",
      subTextHi: isOpen
        ? `रात 10:00 बजे तक खुली रहेगी (वर्तमान समय: ${formattedCurrentTime})`
        : `सुबह 8:00 बजे खुलेगी (वर्तमान समय: ${formattedCurrentTime})`,
      currentTimeIst: formattedCurrentTime
    };
  } catch (e) {
    // Fallback safe calculation if timeZone throws
    return {
      isOpen: true,
      statusTextHi: "अभी दुकान खुली है",
      subTextHi: "सोमवार से रविवार: सुबह 8:00 से रात 10:00",
      currentTimeIst: ""
    };
  }
}

function getCurrentIstTimeString(): string {
  try {
    return new Intl.DateTimeFormat("hi-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(new Date());
  } catch {
    return "";
  }
}
