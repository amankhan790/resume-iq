
export async function uploadResume(supabase, {

    fileName, resumeText, jobTitle, jobDescription,
    companyName, score, feedback   // ← add companyName
}) {
    const { data, error } = await supabase
        .from('resumes')
        .insert({
            file_name: fileName,
            resume_text: resumeText,
            job_title: jobTitle,
            job_description: jobDescription,
            company_name: companyName,   // ← add this
            score,
            feedback,
        })
        .select()
        .single()

    if (error) throw error
    return data
}