import Joi from "joi";

export const createJobSchema = Joi.object({
  title: Joi.string().min(3).max(120).required(),
  description: Joi.string().min(10).required(),
  location: Joi.string().min(2).required(),
  company: Joi.string().min(2).required(),
  jobType: Joi.string().valid("Full-time", "Part-time", "Internship", "Contract", "Other").optional(),
  salaryText: Joi.string().optional(),
  remote: Joi.boolean().optional(),

  // optional metadata
  jobUrl: Joi.string().uri().optional(),
  logoUrl: Joi.string().uri().optional(),
  category: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  publishedAt: Joi.date().optional(),
});

export const updateJobSchema = createJobSchema.fork(
  ["title", "description", "location", "company"],
  (s) => s.optional()
);
