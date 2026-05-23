export async function uploadResume(supabase, {
    userId,
    fileName,
    resumeText,
    jobTitle,
    jobDescription,
    companyName,
    score,
    feedback,
}) {
    const { data, error } = await supabase
        .from("resumes")
        .insert({
            user_id: userId,
            file_name: fileName,
            resume_text: resumeText,
            job_title: jobTitle,
            job_description: jobDescription,
            company_name: companyName,
            score,
            feedback,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}


export async function getResumeById(supabase, resumeId, userId) {
    const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", resumeId)
        .eq("user_id", userId)
        .single();

    if (error) throw error;
    return data;
}