import { logError } from "@/services/logging";
import { FirebaseTimestamp } from "@/types";
import { type ClassValue, clsx } from "clsx";
import {
  addMinutes,
  differenceInHours,
  differenceInMinutes,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  endOfToday,
  format,
  parse,
  startOfDay,
  subDays,
} from "date-fns";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";
import { parsePhoneNumber } from "libphonenumber-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getVideoDuration = async (file: File): Promise<number> => {
  const url = URL.createObjectURL(file);
  const audio = document.createElement("audio");
  audio.src = url;
  audio.muted = true;
  audio.preload = "metadata";

  return new Promise((resolve) => {
    audio.onloadedmetadata = () => {
      const duration = Math.floor(audio.duration);
      resolve(duration);
    };
  });
};

export const convertToShortScale = (num: number): string => {
  if (num <= 1000) {
    return num.toString();
  }

  const suffixes: string[] = ["", "k", "M", "B", "T"];
  const suffixNum: number = Math.floor(("" + num).length / 3);
  let shortNum: number = parseFloat(
    (suffixNum !== 0 ? num / Math.pow(1000, suffixNum) : num).toPrecision(2)
  );
  if (shortNum % 1 !== 0) {
    shortNum = parseFloat(shortNum.toFixed(1));
  }
  return shortNum + suffixes[suffixNum];
};

const DATE_FORMAT = "yyyy/MM/dd";

/**
 * Converts a Date object to a formatted string.
 *
 * @param {Date} date - The date to be formatted.
 * @returns {string} The formatted date string in 'yyyy/MM/dd' format.
 */
export const dateToString = (date: Date): string => {
  return format(date, DATE_FORMAT);
};

/**
 * Converts a formatted date string to a Date object.
 *
 * @param {string} dateString - The date string in 'yyyy/MM/dd' format to be parsed.
 * @returns {Date} The parsed Date object.
 */
export const stringToDate = (dateString: string): Date => {
  return parse(dateString, DATE_FORMAT, new Date());
};

/**
 * Adds the specified number of minutes to the current time or sets the time to the end of the day if the
 * specified minutes exceed the remaining minutes of the day.
 *
 * @param {number} additionalMinutes - The number of minutes to add to the current time.
 * @returns {string} The new time in "HH:mm" format.
 */
export const addMinutesOrEndOfDay = (additionalMinutes: number) => {
  const now: Date = new Date();
  const minutesUntilEndOfDay: number = differenceInMinutes(endOfToday(), now);

  let newTime: Date;

  if (minutesUntilEndOfDay >= additionalMinutes)
    newTime = addMinutes(now, additionalMinutes);
  else newTime = endOfToday();

  return format(newTime, "HH:mm");
};

export const firebaseTimestampToReadAbleDate = (
  timestamp: FirebaseTimestamp | Timestamp
): string => {
  let date: Date;

  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else if (
    typeof timestamp === "object" &&
    "_seconds" in timestamp &&
    "_nanoseconds" in timestamp
  ) {
    date = new Date(
      timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
    );
  } else {
    logError("Invalid timestamp format:", timestamp);
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
};

export const timestampToDate = (
  timestamp: FirebaseTimestamp | Timestamp
): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  const date = new Date();
  date.setTime(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
  return date;
};

export const dateToTimestamp = (date: Date): FirebaseTimestamp => {
  return {
    _seconds: Math.floor(date.getTime() / 1000),
    _nanoseconds: (date.getTime() % 1000) * 1000000,
  };
};

export const getVideoMetaData = async (
  file: File
): Promise<{ duration: number; aspectRatio: number }> => {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.preload = "metadata";
  video.src = url;

  return new Promise((resolve, reject) => {
    video.onloadedmetadata = () => {
      resolve({
        duration: Math.floor(video.duration),
        aspectRatio: video.videoWidth / video.videoHeight,
      });
    };
    video.onerror = reject;
  });
};

export const isElementInView = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  const viewHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= viewHeight &&
    rect.right <= viewWidth
  );
};

export const formatCurrency = (
  value: number,
  locale: string = "en-US",
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

export const formatFullMonth = (shortMonth: string): string => {
  const date = parse(shortMonth, "MMM", new Date());
  return format(date, "MMMM");
};

export const convert24hTo12h = (time24h: string): string => {
  const date = parse(time24h, "HH:mm", new Date());
  return format(date, "hh:mm aa");
};

export const getDateDaysAgo = (daysAgo: number): Date =>
  startOfDay(subDays(new Date(), daysAgo));

export const convertToDate = (timestamp: Timestamp | number) => {
  return timestamp instanceof Timestamp
    ? timestamp.toDate()
    : new Date(timestamp);
};

export const formatTimeDifference = (sentAt: Timestamp): string => {
  const date = sentAt.toDate();
  const now = new Date();

  const yearsDiff = differenceInYears(now, date);
  if (yearsDiff >= 1) {
    return `${yearsDiff}y`;
  }

  const monthsDiff = differenceInMonths(now, date);
  if (monthsDiff >= 1) {
    return `${monthsDiff}m`;
  }

  const daysDiff = differenceInDays(now, date);
  if (daysDiff >= 1) {
    return `${daysDiff}d`;
  }

  const hoursDiff = differenceInHours(now, date);
  if (hoursDiff >= 1) {
    return `${hoursDiff}h`;
  }

  const minutesDiff = differenceInMinutes(now, date);
  if (minutesDiff >= 1) {
    return `${minutesDiff}m`;
  }

  return "now";
};

export const formatPhoneNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  const phoneNumber = parsePhoneNumber(phone);
  const countryCode = phoneNumber.countryCallingCode
    ? `+${phoneNumber.countryCallingCode}`
    : "";
  if (digits.length < countryCode.length + 7 || digits.length > 15) {
    return "Invalid number";
  }
  const numberPart = digits.slice(countryCode.length - 1);
  const formattedNumber = `(${numberPart.slice(0, 3)}) ${numberPart.slice(3, 6)}-${numberPart.slice(6, 10)}`;
  const remainingDigits = numberPart.slice(10);
  return `${countryCode} ${formattedNumber}${remainingDigits ? ` ${remainingDigits}` : ""}`.trim();
};
