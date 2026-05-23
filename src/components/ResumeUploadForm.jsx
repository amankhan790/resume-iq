import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import { extractTextFromPDF } from "../utils/ExtractPdfText";
import { analyzeResumeWithAI } from "../services/AnalyzeResume";
import { useSupabaseClient } from "../utils/supabase";
import { useUser } from "@clerk/react";
import { uploadResume } from "../api/resume";

const resumeSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),

  jobTitle: z.string().min(2, "Job title is required"),

  jobDescription: z
    .string()
    .min(20, "Description must be at least 20 characters"),

  resume: z
    .any()
    .refine((file) => file, "Resume is required")
    .refine(
      (file) =>
        ["application/pdf", "image/png", "image/jpeg"].includes(file?.type),
      "Only PDF, PNG, JPG allowed",
    )
    .refine((file) => file?.size <= 10 * 1024 * 1024, "Max file size is 10MB"),
});
const ResumeUploadForm = () => {
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  const [status, setStatus] = useState("");

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      companyName: "",
      jobTitle: "",
      jobDescription: "",
      resume: null,
    },
  });

  const file = watch("resume");

  const [error, setError] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];

      if (selectedFile) {
        setValue("resume", selectedFile, {
          shouldValidate: true,
        });
      }
    },
    [setValue],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const onSubmit = async (data) => {
    setError(null);

    try {
      // 2. extract text from PDF
      setStatus("Extracting resume text...");
      const resumeText = await extractTextFromPDF(data.resume);

      // 3. analyze with Claude via Supabase Edge Function
      setStatus("Analyzing resume with AI...");
      const feedback = await analyzeResumeWithAI(supabase, {
        resumeText,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
      });

      // 4. save everything to Supabase
      setStatus("Saving results...");
      const saved = await uploadResume(supabase, {
        userId: user.id,
        fileName: data.resume.name,
        resumeText,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        score: feedback.score,
        feedback,
      });

      // 5. redirect to results page
      navigate(`/resume/${saved.id}`);
    } catch (err) {
      console.error(err);
      setError(err);
      setStatus("");
    }
  };

  return (
    <>
      <div className="text-center mb-2">
        <h1 className="text-4xl font-bold ">
          Smart feedback
          <br />
          for your dream job
        </h1>

        <p className="text-muted-foreground text-lg">
          Drop your resume for an ATS score and improvement tips.
        </p>
      </div>
      <div className="lg:w-[60%]  w-full max-w-4xl mx-auto rounded-[40px] border border-white/30 bg-white/40 backdrop-blur-xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Heading */}

          {/* Company Name */}
          <div className="space-y-2">
            <label>Company Name</label>

            <Input
              placeholder="Google"
              {...register("companyName")}
              className="h-10 rounded-2xl"
            />

            {errors.companyName && (
              <p className="text-red-500 text-sm">
                {errors.companyName.message}
              </p>
            )}
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <label>Job Title</label>

            <Input
              placeholder="Frontend Developer"
              {...register("jobTitle")}
              className="h-10 rounded-2xl"
            />

            {errors.jobTitle && (
              <p className="text-red-500 text-sm">{errors.jobTitle.message}</p>
            )}
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <label>Job Description</label>

            <Textarea
              rows={5}
              placeholder="Write job requirements..."
              {...register("jobDescription")}
              className="rounded-2xl overflow-y-scroll h-auto max-h-30 resize-none no-scrollbar"
            />

            {errors.jobDescription && (
              <p className="text-red-500 text-sm">
                {errors.jobDescription.message}
              </p>
            )}
          </div>

          {/* Upload */}
          <div className="space-y-2">
            <label>Upload Resume</label>

            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-3xl p-6
                text-center cursor-pointer transition-all
                ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white/70"
                }
                    `}
            >
              <input {...getInputProps()} />

              <div className="space-y-3">
                <div className="text-5xl">📄</div>

                <p className="font-medium">Click to upload or drag and drop</p>

                <p className="text-sm text-muted-foreground">
                  PDF, PNG or JPG (max. 10MB)
                </p>

                {file && (
                  <div className="mt-4 text-sm font-medium text-blue-600">
                    {file.name}
                  </div>
                )}
              </div>
            </div>

            {errors.resume && (
              <p className="text-red-500 text-sm">{errors.resume.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            // disabled={isSubmitting}
            className="w-full h-10 rounded-2xl text-lg bg-gradient-to-r from-indigo-500 to-blue-500"
          >
            {isSubmitting ? "Analyzing..." : "Save & Analyze Resume"}
          </Button>
          {error && (
            <p className="text-red-500 text-sm">
              {error.message || "Upload failed"}
            </p>
          )}
          {!status && <p className="text-sm m-auto  text-gray-600">{status}</p>}
        </form>
      </div>
    </>
  );
};

export default ResumeUploadForm;
