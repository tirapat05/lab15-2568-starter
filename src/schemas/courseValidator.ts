import { z } from "zod";

export const zCourseId = z.number().int().refine(val => val >= 100000 && val <= 999999, {
  message: "Number must be exactly 6 digits"});
const zCourseTitle = z.string()
const zInstructors = z.array(z.string());

export const zCoursePostBody = z.object({
  courseId: zCourseId,
  courseTitle: zCourseTitle,
  instructors: zInstructors,
});

export const zCoursePutBody = z.object({
  courseId: zCourseId,
  courseTitle: zCourseTitle.nullish(),//CourseTitle can be null or undefined
  instructors: zInstructors.nullish(), //Instructors can be null or undefined
});

export const zCourseDeleteBody = z.object({
  courseId: zCourseId
});