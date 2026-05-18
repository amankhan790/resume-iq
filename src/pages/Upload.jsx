import React from "react";
import { z } from "zod";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const Upload = () => {
  const uploadSchema = z.object({
    companyName: z.string().min(1, { message: "Company name is required." }),
    jobTitle: z.string().min(1, { message: "Job title is required." }),
    jobDescription: z
      .string()
      .min(1, { message: "Job description is required." }),
    file: z.instanceof(File, { message: "Please upload a valid file." }),
  });

  return (
    <div className="pt-28 lg:pt-32 ">
      <h2 className="text-center text-6xl font-bold ">
        Smart Feedback <br />
        For Your Resumes
      </h2>

      <Field className="mt-10 w-[80%] mx-auto">
        <FieldLabel htmlFor="input-field-username">Company Nmae</FieldLabel>
        <Input
          id="input-field-username"
          type="text"
          placeholder="Enter company name"
        />
        <FieldLabel htmlFor="input-field-username">Job Tittle</FieldLabel>
        <Input
          id="input-field-username"
          type="text"
          placeholder="Enter job title"
        />
        <FieldLabel htmlFor="input-field-username">Job Description</FieldLabel>
        <Input
          id="input-field-username"
          type="text"
          placeholder="Enter job description"
          className="h-32"
        />
        <FieldLabel htmlFor="input-field-username">Upload resume</FieldLabel>
        <Input id="input-field-username" type="file" acceep className="h-32" />
      </Field>
    </div>
  );
};

export default Upload;
