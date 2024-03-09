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
  const res = await fetch(`${URL}?userId=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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