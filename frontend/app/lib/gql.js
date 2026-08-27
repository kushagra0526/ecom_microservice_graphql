const GQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL;

export async function gql(query, variables, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(GQL_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
        cache: 'no-store',
    });

    if (!res.ok) throw new Error(`Gateway unreachable (${res.status})`);

    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors[0].message);
    return json.data;
}
