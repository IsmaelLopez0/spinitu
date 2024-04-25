import { toast } from 'sonner';
import { genericFetch } from '@/libs/externalAPIs';

const URL = '/notification';

export const setToast = (message, type, id) => {
  const options = { duration: 2500, id };
  if (!type) {
    toast(message, options);
  } else {
    toast[type](message, options);
  }
};

export async function createNotification(userId, title, body) {
  if (!userId) return;
  const params = {
    url: URL,
    body: { userId, title, body },
    method: 'POST',
  };
  const res = await genericFetch(params);
  if (res.statusCode === 200) {
    return res.body;
  }
  setToast(res.body.error, 'error', params.url + res.statusCode);
  return res;
}

export async function readNotification(userId) {
  const params = {
    url: URL,
    query: { userId },
    method: 'GET',
  };
  const res = await genericFetch(params);
  if (res.statusCode === 200) {
    return res.body;
  }
  setToast(res.body.error, 'error', params.url + res.statusCode);
}

export async function updateNotification(userId, notificationId) {
  const params = {
    url: URL,
    body: { userId, notificationId },
    method: 'PUT',
  };
  const res = await genericFetch(params);
  if (res.statusCode === 200) {
    return res.body;
  }
  setToast(res.body.error, 'error', params.url + res.statusCode);
}
