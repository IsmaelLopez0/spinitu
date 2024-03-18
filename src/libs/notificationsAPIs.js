import { unstable_noStore as noStore } from "next/cache";
import { toast } from "sonner";
const URL = "/api/notification";

export async function createNotification(userId, title, body) {
  const res = await fetch(URL, {
    method: "POST",
    body: JSON.stringify({ userId, title, body }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
}

export async function readNotification(userId) {
  noStore();
  const res = await fetch(`${URL}?userId=${userId}`, {
    cache: "no-store",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
  const data = await res.json();
  return data;
}

export async function updateNotification(userId, notificationId) {
  const res = await fetch(URL, {
    method: "PUT",
    body: JSON.stringify({ userId, notificationId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
}

export const setToast = (message, type, id) => {
  const options = { duration: 2500, id };
  if (!type) {
    toast(message, options);
  } else {
    toast[type](message, options);
  }
};
