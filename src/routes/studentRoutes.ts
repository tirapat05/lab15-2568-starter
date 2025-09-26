import { Router, type Request, type Response } from "express";

// import database
import { students } from "../db/db.js";
import {
  zStudentDeleteBody,
  zStudentPostBody,
  zStudentPutBody,
  zStudentId,
} from "../schemas/studentValidator.js";
import type { Student } from "../libs/types.js";

const router = Router();

router.get("/students", (req: Request, res: Response) => {
  try {
    const program = req.query.program;

    if (program) {
      let filtered_students = students.filter(
        (student) => student.program === program
      );
      return res.status(200).json({
        success: true,
        data: filtered_students,
      });
    } else {
      return res.status(200).json({
        success: true,
        data: students,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

/// GET /students/studentId

router.get("/students/:studentId", (req: Request, res: Response) => {
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
    const foundIndex = students.findIndex(
      (student) => student.studentId === studentId
    );

    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Student does not exists",
      });
    }  

    // add response header 'Link'
    res.set("Link", `/students/${studentId}`);

    return res.json({
      success: true,
      message: "Here is your student",
      data: students[foundIndex],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

// POST /students, body = {new student data}
// add a new student
router.post("/students", (req: Request, res: Response) => {
  try {
    const body = req.body as Student;

    // validate req.body with predefined validator
    const result = zStudentPostBody.safeParse(body); 
    if (!result.success) {
      return res.json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    //check duplicate studentId
    const found = students.find(
      (student) => student.studentId === body.studentId
    );
    if (found) {
      return res.status(409).json({
        success: false,
        message: "Student is already exists",
      });
    }

    // add new student
    const new_student = body;
    students.push(new_student);

    // add response header 'Link'
    res.set("Link", `/students/${new_student.studentId}`);

    return res.status(201).json({
      success: true,
      data: new_student,
    });
    // return res.json({ ok: true, message: "successfully" });
  } catch (err) {
    return res.json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

// PUT /students, body = {studentId}
// Update specified student
router.put("/students", (req: Request, res: Response) => {
  try {
    const body = req.body as Student;

    // validate req.body with predefined validator
    const result = zStudentPutBody.safeParse(body); 
    if (!result.success) {
      return res.json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    //check duplicate studentId
    const foundIndex = students.findIndex(
      (student) => student.studentId === body.studentId
    );

    if (foundIndex === -1) {
      return res.json({
        success: false,
        message: "Student does not exists",
      });
    }

    // update student data
    students[foundIndex] = { ...students[foundIndex], ...body };

    // add response header 'Link'
    res.set("Link", `/students/${body.studentId}`);

    return res.json({
      success: true,
      message: `Student ${body.studentId} has been updated successfully`,
      data: students[foundIndex],
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

// DELETE /students, body = {studentId}
router.delete("/students", (req: Request, res: Response) => {
  try {
    const body = req.body;
    const parseResult = zStudentDeleteBody.safeParse(body);

    if (!parseResult.success) {
      return res.json({
        success: false,
        message: "Validation failed",
        error: parseResult.error.issues[0]?.message,
      });
    }

    const foundIndex = students.findIndex(
      (std: Student) => std.studentId === body.studentId
    );

    if (foundIndex === -1) {
      return res.json({
        success: false,
        message: "Student does not exists",
      });
    }

    // delete found student from array
    students.splice(foundIndex, 1);

    res.json({
      success: true,
      message: `Student ${body.studentId} has been deleted successfully`,
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

export default router