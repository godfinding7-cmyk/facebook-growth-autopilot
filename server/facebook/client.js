export function facebookConfigured() {
  return Boolean(process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_ACCESS_TOKEN);
}

function config() {
  if (!facebookConfigured()) {
    const err = new Error('Facebook Page credentials are not configured');
    err.code = 'FB_NOT_CONFIGURED';
    throw err;
  }

  return {
    version: process.env.META_GRAPH_VERSION || 'v26.0',
    pageId: process.env.FACEBOOK_PAGE_ID,
    token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN
  };
}

async function graphRequest(path, options = {}) {
  const { version, token } = config();
  const url = new URL(`https://graph.facebook.com/${version}/${path}`);
  if (!options.body) url.searchParams.set('access_token', token);

  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = new Error(data?.error?.message || 'Facebook Graph API request failed');
    err.details = {
      type: data?.error?.type,
      code: data?.error?.code,
      subcode: data?.error?.error_subcode
    };
    throw err;
  }

  return data;
}

export async function checkFacebookPage() {
  const { pageId } = config();
  const data = await graphRequest(`${encodeURIComponent(pageId)}?fields=id,name`);
  return { connected: true, id: data.id, name: data.name || null };
}

export async function publishTextPost(message) {
  const { version, pageId, token } = config();
  const endpoint = `https://graph.facebook.com/${version}/${encodeURIComponent(pageId)}/feed`;
  const body = new URLSearchParams({ message, access_token: token });

  const response = await fetch(endpoint, { method: 'POST', body });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = new Error(data?.error?.message || 'Facebook publish failed');
    err.details = {
      type: data?.error?.type,
      code: data?.error?.code,
      subcode: data?.error?.error_subcode
    };
    throw err;
  }

  return data;
}
