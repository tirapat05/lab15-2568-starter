import type { Student, Course } from "../libs/types.js";
export let students: Student[] = [

    {
      studentId: "650610001",
      firstName: "Matt",
      lastName: "Damon",
      program: "CPE",
    },
    {
      studentId: "650610002",
      firstName: "Cillian",
      lastName: "Murphy",
      program: "CPE",
      courses: [261207, 261497]
    },
    {
      studentId: "650610003",
      firstName: "Emily",
      lastName: "Blunt",
      program: "ISNE",
      courses: [269101, 261497]
    },
  ]

  export let courses: Course[] = [
    {
      courseId: 261207,
      courseTitle: "Basic Computer Engineering Lab",
      instructors: ['Dome','Chanadda']
    },
    {
      courseId: 261497,
      courseTitle: "Full Stack Development",
      instructors: ['Dome',"Nirand", "Chanadda"]
    },
    {
      courseId: 269101,
      courseTitle: "Introduction to Information Systems and Network Engineering",
      instructors: ['KENNETH COSH']
    }
  ];
