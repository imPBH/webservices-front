const buildHeaders = (bearerToken?: string, apiKey?: string) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (bearerToken) {
        headers['Authorization'] = `Bearer ${bearerToken}`;
    }

    if (apiKey) {
        headers['X-API-Key'] = apiKey;
    }

    return { headers };
}
  
const defaultPostOptions = {
    method: 'POST',
};
  
const defaultPatchOptions = {
    method: 'PATCH',
};

const defaultPutOptions = {
    method: 'PUT',
};

const defaultDeleteOptions = {
    method: 'DELETE',
};
  
async function fetchJson({ url, options, content }: { url: string; options?: object; content?: object }) {
    const body = JSON.stringify(content);
    const response = await fetch(url, { ...options, body });
    if (!response.ok) {
        return response.json().then((reason) => Promise.reject(reason));
    }
    return await response.json();
}
  
export const jsonApi = {
    get: ({url, options, bearerToken, apiKey}: {url: string, options?: object, bearerToken?: string, apiKey?: string}) => {
        return fetchJson({ url, options: { ...buildHeaders(bearerToken, apiKey), ...options} });
    },

    post: ({url, content, options, bearerToken, apiKey}: {url: string, content?: object, options?: object, bearerToken?: string, apiKey?: string}) => {
        return fetchJson({ url, options: { ...buildHeaders(bearerToken, apiKey), ...defaultPostOptions, ...options }, content });
    },

    patch: ({url, content, options, bearerToken, apiKey}: {url: string, content: object, options?: object, bearerToken?: string, apiKey?: string}) => {
        return fetchJson({ url, options: { ...buildHeaders(bearerToken, apiKey), ...defaultPatchOptions, ...options }, content });
    },

    put: ({url, content, options, bearerToken, apiKey}: {url: string, content: object, options?: object, bearerToken?: string, apiKey?: string}) => {
        return fetchJson({ url, options: { ...buildHeaders(bearerToken, apiKey), ...defaultPutOptions, ...options }, content });
    },

    delete: ({url, content, options, bearerToken, apiKey}: {url: string, content?: object, options?: object, bearerToken?: string, apiKey?: string}) => {
        return fetchJson({ url, options: { ...buildHeaders(bearerToken, apiKey), ...defaultDeleteOptions, ...options }, content });
    }
};
  