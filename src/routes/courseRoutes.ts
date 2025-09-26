import { Router, type Request, type Response } from "express";
import { students,courses} from "../db/db.js";
import { zStudentId } from "../schemas/studentValidator.js";
import { zCourseId,zCoursePostBody,zCoursePutBody,zCourseDeleteBody } from "../schemas/courseValidator.js";
import type { Course } from "../libs/types.js";
const router: Router = Router();

// READ all
router.get("/students/:studentId/courses", (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;

    const result = zStudentId.safeParse(studentId); 
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    //check duplicate studentId
    const student = students.find((s) => s.studentId === studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student does not exist`,
      });
    }
    // add response header 'Link'
    res.set("Link", `/students/${studentId}/courses`);

    const courseIds = student.courses || [];

    const enrolledCourses = courseIds
      .map((id) => {
        const c = courses.find((cc) => cc.courseId === id);
        if (!c) return null;
        return {
          courseId: c.courseId,
          courseTitle: c.courseTitle,
        };
      });

    return res.json({
      success: true,
      message: `Get courses detail of student ${studentId}`,
      data:{
        studentId:studentId,
        courses: enrolledCourses,
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

// Params URL
router.get("/courses/:courseId", (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const cId = Number(courseId);

    const result = zCourseId.safeParse(cId); // check zod
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: "Invalid inpput: expected number, received NaN",
      });
    }

    const course = courses.find((c) => c.courseId === cId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `course does not exist`,
      });
    }
    // add response header 'Link'
    res.set("Link", `/courses/${courseId}`);

    return res.json({
      success: true,
      message: `Get course ${courseId} successfully`,
      data: course
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

router.post("/courses", (req: Request, res: Response) => {
  try {
    const body = req.body as Course;

    // validate req.body with predefined validator
    const result = zCoursePostBody.safeParse(body); 
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    //check duplicate
    const found = courses.find(
      (course) => course.courseId === body.courseId
    );
    if (found) {
      return res.status(409).json({
        success: false,
        message: "Course Id is already exists",
      });
    }

    // add new
    const new_course = body;
    courses.push(new_course);

    // add response header 'Link'
    res.set("Link", `/courses/${new_course.courseId}`);

    return res.status(201).json({
      success: true,
      Message: `Course ${new_course.courseId} has been added successfully`,
      data: new_course,
    });
    // return res.json({ ok: true, message: "successfully" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

router.put("/courses", (req: Request, res: Response) => {
  try {
    const body = req.body as Course;

    // validate req.body with predefined validator
    const result = zCoursePutBody.safeParse(body); 
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    //check duplicate studentId
    const foundIndex = courses.findIndex(
      (course) => course.courseId === body.courseId
    );

    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Course Id does not exists",
      });
    }

    // update student data
    courses[foundIndex] = { ...courses[foundIndex], ...body };

    // add response header 'Link'
    res.set("Link", `/course/${body.courseId}`);

    return res.status(200).json({
      success: true,
      message: `Student ${body.courseId} has been updated successfully`,
      data: courses[foundIndex],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

router.delete("/courses", (req: Request, res: Response) => {
  try {
    const body = req.body;
    const parseResult = zCourseDeleteBody.safeParse(body);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: parseResult.error.issues[0]?.message,
      });
    }

    const foundIndex = courses.findIndex(
      (cc: Course) => cc.courseId === body.courseId
    );

    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Course Id does not exists",
      });
    }

    // clone object 
    const deletedCourse = { ...courses[foundIndex] };

    // ลบออกจาก array
    courses.splice(foundIndex, 1);

    return res.status(200).json({
      success: true,
      message: `Course ${body.courseId} has been deleted successfully`,
      data: deletedCourse,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

export default router;