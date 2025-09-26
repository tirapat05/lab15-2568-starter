import express from "express";
import morgan from 'morgan';
import type { Request, Response } from "express";
import router from "./routes/courseRoutes.js";

const app: any = express();

//Middleware
app.use(express.json());
app.use(morgan('dev'));


app.get("/",(req: Request, res: Response) => {
    return res.status(200).json({
	success: true,
	message: "lab 15 API service successfully"
});
});

app.get("/me",(req: Request, res: Response) => {
    return res.status(200).json({
	success : true,
	message : "Student Information",
	data : {
		studentId : "670612123",
		firstName : "Tirapat",
		lastName : "Ruangkling",
		program : "CPE",
		section : "801"
        }
    });
});

app.use("/api/v2", router);

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);

export default app;