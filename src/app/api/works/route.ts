import { getWorksByOrcid } from "@/lib/openalex";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orcid = searchParams.get('orcid');
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('perPage') || '25';

    if (!orcid) {
        return Response.json({ error: 'ORCID is required' }, { status: 400 });
    }

    try {
        const data = await getWorksByOrcid(orcid, parseInt(page), parseInt(perPage));
        if (!data) {
            return Response.json({ error: 'Failed to fetch from OpenAlex' }, { status: 500 });
        }
        return Response.json(data);
    } catch (err) {
        console.error("API Route Error:", err);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
