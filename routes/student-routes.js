const express = require("express");
const {
  addStudent,
  getAllStudents,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  pagination,
} = require("../controllers/studentController");

const router = express.Router();

router.post("/student", addStudent);
router.get("/student", getAllStudents);
router.get("/students", getStudents);
router.get("/student/:id", getStudentById);
router.put("/student/:id", updateStudent);
router.delete("/student/:id", deleteStudent);
router.get("/pagination", pagination);

module.exports = {
  routes: router,
};
