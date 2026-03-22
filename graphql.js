// graphql.js
import { gql } from "apollo-server-express";
import Student from "./student.js";    // Mongoose model
import Teacher from "./teacher.js";    // Mongoose model
import Attendance from "./attendance.js"; // Mongoose model

// ------------------ TypeDefs ------------------
export const typeDefs = gql`
  type Student {
    id: ID!
    name: String!
    age: Int!
    grade: String!
    email: String!
  }

  type Teacher {
    id: ID!
    name: String!
    subject: String!
    email: String!
  }

  type Attendance {
    id: ID!
    student: Student!
    date: String!
    status: String!
  }

  type Query {
    students: [Student]
    student(id: ID!): Student

    teachers: [Teacher]
    teacher(id: ID!): Teacher

    attendanceRecords: [Attendance]
    attendanceByStudent(studentId: ID!): [Attendance]
  }

  type Mutation {
    addStudent(name: String!, age: Int!, grade: String!, email: String!): Student
    updateStudent(id: ID!, name: String, age: Int, grade: String, email: String): Student
    deleteStudent(id: ID!): Student

    addTeacher(name: String!, subject: String!, email: String!): Teacher
    updateTeacher(id: ID!, name: String, subject: String, email: String): Teacher
    deleteTeacher(id: ID!): Teacher

    addAttendance(studentId: ID!, date: String!, status: String!): Attendance
    updateAttendance(id: ID!, status: String): Attendance
    deleteAttendance(id: ID!): Attendance
  }
`;

// ------------------ Resolvers ------------------
export const resolvers = {
  Query: {
    // Students
    students: async () => await Student.find(),
    student: async (_, { id }) => await Student.findById(id),

    // Teachers
    teachers: async () => await Teacher.find(),
    teacher: async (_, { id }) => await Teacher.findById(id),

    // Attendance
    attendanceRecords: async () => await Attendance.find(),
    attendanceByStudent: async (_, { studentId }) =>
      await Attendance.find({ studentId }),
  },

  Mutation: {
    // Student CRUD
    addStudent: async (_, { name, age, grade, email }) => {
      const newStudent = new Student({ name, age, grade, email });
      await newStudent.save();
      return newStudent;
    },
    updateStudent: async (_, { id, name, age, grade, email }) => {
      return await Student.findByIdAndUpdate(
        id,
        { name, age, grade, email },
        { new: true } // return the updated document
      );
    },
    deleteStudent: async (_, { id }) => {
      return await Student.findByIdAndDelete(id);
    },

    // Teacher CRUD
    addTeacher: async (_, { name, subject, email }) => {
      const newTeacher = new Teacher({ name, subject, email });
      await newTeacher.save();
      return newTeacher;
    },
    updateTeacher: async (_, { id, name, subject, email }) => {
      return await Teacher.findByIdAndUpdate(
        id,
        { name, subject, email },
        { new: true }
      );
    },
    deleteTeacher: async (_, { id }) => {
      return await Teacher.findByIdAndDelete(id);
    },

    // Attendance CRUD
    addAttendance: async (_, { studentId, date, status }) => {
      const newAttendance = new Attendance({ studentId, date, status });
      await newAttendance.save();
      return newAttendance;
    },
    updateAttendance: async (_, { id, status }) => {
      return await Attendance.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
    },
    deleteAttendance: async (_, { id }) => {
      return await Attendance.findByIdAndDelete(id);
    },
  },

  // Resolve student info in attendance
  Attendance: {
    student: async (parent) => await Student.findById(parent.studentId),
  },
};