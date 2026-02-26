export interface OpenAlexWork {
    id: string                          // "https://openalex.org/W..."
    title: string
    display_name: string
    publication_year: number
    publication_date: string
    doi: string | null
    cited_by_count: number
    type: string                        // "article", "book-chapter" vb.
    open_access: {
        is_oa: boolean
        oa_status: string                 // "gold", "green", "bronze", "closed"
        oa_url: string | null
    }
    primary_location: {
        source: {
            display_name: string            // Dergi adı
            issn_l: string | null
        } | null
        landing_page_url: string | null
    } | null
    authorships: Array<{
        author: {
            display_name: string
            orcid: string | null
        }
        institutions: Array<{
            display_name: string
            country_code: string
        }>
    }>
    biblio: {
        volume: string | null
        issue: string | null
        first_page: string | null
        last_page: string | null
    }
    topics: Array<{
        display_name: string
        score: number
    }>
}

export interface OpenAlexAuthor {
    id: string
    display_name: string
    orcid: string | null
    works_count: number
    cited_by_count: number
    summary_stats: {
        h_index: number
        i10_index: number
        '2yr_mean_citedness': number
    }
    counts_by_year: Array<{
        year: number
        works_count: number
        cited_by_count: number
    }>
    topics: Array<{
        display_name: string
        count: number
        field: { display_name: string }
    }>
}
