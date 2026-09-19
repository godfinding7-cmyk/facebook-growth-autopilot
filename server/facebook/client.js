export function facebookConfigured() {
  return Boolean(process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_ACCESS_TOKEN);
}

export async function publishTextPost(message) {
  if (!facebookConfigured()) {
    const err = new Error('Facebook Page credentials are not configured');
    err.code = 'FB_NOT_CONFIGURED';
    throw err;
  }

  const version = process.env.META_GRAPH_VERSION || 'v23.0';
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const endpoint = `https://graph.facebook.com/${version}/${encodeURIComponent(pageId)}/feed`;

  const body = new URLSearchParams({ message, access_token: token });
  const response = await fetch(endpoint, { method: 'POST', body });
  const data = await response.json();
  if (!response.ok) {
    const err = new Error(data?.error?.message || 'Facebook publish failed');
    err.details = data;
    throw err;
  }
  return data;
}
