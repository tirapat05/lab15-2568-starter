import { z } from "zod";

export const zStudentId = z
  .string()
  .length(9, { message: "Student Id must contain 9 characters" });
const zFirstName = z
  .string()
  .min(3, { message: "First name requires at least 3 charaters" });
const zLastName = z
  .string()
  .min(3, { message: "Last name requires at least 3 characters" });
const zProgram = z.enum(["CPE","ISNE"], {message: "Program must be either CPE or ISNE",});
const zCourse = z.array(z.number());

export const zStudentPostBody = z.object({
  studentId: zStudentId,
  firstName: zFirstName,
  lastName: zLastName,
  program: zProgram,
  course :zCourse.nullish()
});

export const zStudentPutBody = z.object({
  studentId: zStudentId,
  firstName: zFirstName.nullish(), //firstName can be null or undefined
  lastName: zLastName.nullish(), //lastName can be null or undefined
  program: zProgram.nullish(), //program can be null or undefined
});

export const zStudentDeleteBody = z.object({
  studentId: zStudentId
});