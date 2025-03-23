"use strict";

const { db } = require("../db");
const {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
} = require("firebase/firestore");
const Student = require("../models/student");

const addStudent = async (req, res, next) => {
  try {
    const data = req.body;
    const studentRef = doc(collection(db, "students"));
    await setDoc(studentRef, data);
    res.send("Record saved successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const studentRef = collection(db, "students");
    const snapshot = await getDocs(studentRef);
    const students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.send(students);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// get all students using model Student
const getStudents = async (req, res, next) => {
  try {
    const studentRef = collection(db, "students");
    const snapshot = await getDocs(studentRef);

    const students = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const student = new Student(
        doc.id,
        data.firstName,
        data.lastName,
        data.fatherName,
        data.classEnrolled,
        data.age,
        data.phoneNumber,
        data.subject,
        data.year,
        data.semester,
        data.status
      );
      students.push(student);
    });

    res.send(students);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const studentRef = doc(db, "students", id);
    const docSnap = await getDoc(studentRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ message: "No record found" });
    }

    const student = {
      id: docSnap.id,
      ...docSnap.data(),
    };

    res.send(student);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const studentRef = doc(db, "students", id);

    const studentDoc = await getDoc(studentRef);
    if (!studentDoc.exists()) {
      return res.status(404).json({ message: "Student not found" });
    }

    // await setDoc(studentRef, data, { merge: true });
    await updateDoc(studentRef, data);

    res.send("Record updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const studentRef = doc(db, "students", id);

    const studentDoc = await getDoc(studentRef);
    if (!studentDoc.exists()) {
      return res.status(404).json({ message: "Student not found" });
    }

    await deleteDoc(studentRef);

    res.send("Record deleted successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const pagination = async (req, res, next) => {
  try {
    let { page, limit: pageSize } = req.query;
    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 10;

    const studentRef = collection(db, "students");
    const totalSnapshot = await getDocs(studentRef);
    const totalRecords = totalSnapshot.size;
    const totalPages = Math.ceil(totalRecords / pageSize);

    let q = query(studentRef, limit(pageSize));

    if (page > 1) {
      const prevSnapshot = await getDocs(
        query(studentRef, limit((page - 1) * pageSize))
      );
      const lastVisible = prevSnapshot.docs[prevSnapshot.docs.length - 1];

      if (lastVisible) {
        q = query(studentRef, startAfter(lastVisible), limit(pageSize));
      }
    }

    const snapshot = await getDocs(q);
    const students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      page,
      pageSize,
      totalRecords,
      totalPages,
      students,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  pagination,
};
