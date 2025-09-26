interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  program: "CPE" | "ISNE";
  section?: string;
  courses?: number[];
}
export type { Student };

interface Course {
  courseId: number;
  courseTitle: string;
  instructors: string[];
}
export type { Course };