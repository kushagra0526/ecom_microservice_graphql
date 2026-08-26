const GQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL!;

export async function gql<T = unknown>(
    query: string,
    variables?: Record<string, unknown>,
    token?: string
): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(GQL_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
        // no-store so we always get fresh data in server components
        cache: 'no-store',
    });

    if (!res.ok) throw new Error(`Gateway unreachable (${res.status})`);

    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors[0].message);
    return json.data as T;
}
