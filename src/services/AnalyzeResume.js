export async function analyzeResumeWithAI(supabase, { resumeText, jobTitle, jobDescription, companyName }) {
    const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: {
            resumeText,
            jobTitle,
            jobDescription,
            companyName,
        }
    })

    if (error) {
        let details = error.message || 'Analysis failed'

        try {
            const body = await error.context?.json()
            details = body?.details || body?.error || details
        } catch {
            // Supabase function errors do not always include a JSON response body.
        }

        throw new Error(details)
    }

    return data
}
