/**
 * A safe wrapper around fetch() that:
 *  1. Parses JSON only when the response actually has a body
 *  2. Throws a meaningful error for non-ok responses
 *  3. Throws a connection error when the server is unreachable
 *
 * @param {string} url
 * @param {RequestInit} options
 * @returns {Promise<any>} parsed JSON body (or null for empty responses)
 */
export async function safeFetch(url, options = {}) {
  let res;

  try {
    res = await fetch(url, options);
  } catch {
    // fetch() itself threw — server is unreachable or network is down
    throw new Error('Cannot connect to the server. Please check your connection.');
  }

  // Parse body only when there is content
  const contentType = res.headers.get('content-type') || '';
  const hasBody     = contentType.includes('application/json');
  const data        = hasBody ? await res.json() : null;

  if (!res.ok) {
    throw new Error(
      data?.message || `Request failed with status ${res.status}`
    );
  }

  return data;
}
