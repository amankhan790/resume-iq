import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/react";

import { useSupabaseClient } from "../utils/supabase";
import { getResumeById } from "../api/resume";

export default function Resume() {
  const { id } = useParams();
  const { user } = useUser();
  const supabase = useSupabaseClient();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResume() {
      try {
        setLoading(true);
        setError("");

        const data = await getResumeById(supabase, id, user?.id);
        setResume(data);
      } catch (err) {
        setError(err.message || "Failed to load resume report");
      } finally {
        setLoading(false);
      }
    }

    if (id && user?.id) {
      loadResume();
    }
  }, [id, user?.id]);

  if (loading) return <p>Loading report...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!resume) return <p>Resume not found</p>;

  const feedback = resume.feedback;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 pt-32">
      <h1 className="text-3xl font-bold">Resume Analysis Report</h1>

      <div className="border rounded-xl p-6 bg-white">
        <p className="text-gray-500">{resume.company_name}</p>
        <h2 className="text-2xl font-semibold">{resume.job_title}</h2>
        <p className="text-5xl font-bold mt-4">{resume.score}/100</p>
      </div>

      <section className="border rounded-xl p-6 bg-white">
        <h2 className="text-xl font-semibold">Summary</h2>
        <p className="mt-2">{feedback?.summary}</p>
      </section>

      <section className="border rounded-xl p-6 bg-white">
        <h2 className="text-xl font-semibold">Strengths</h2>
        <ul className="list-disc pl-5 mt-2">
          {feedback?.strengths?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="border rounded-xl p-6 bg-white">
        <h2 className="text-xl font-semibold">Improvements</h2>
        <ul className="list-disc pl-5 mt-2">
          {feedback?.improvements?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="border rounded-xl p-6 bg-white">
        <h2 className="text-xl font-semibold">Missing Keywords</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {feedback?.keywords_missing?.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-red-100 text-red-700"
            >
              {keyword}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
