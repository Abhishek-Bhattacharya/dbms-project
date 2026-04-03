package com.hostel.hostelmanagement.controller;

import com.hostel.hostelmanagement.model.Grievance;
import com.hostel.hostelmanagement.model.Student;
import com.hostel.hostelmanagement.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/register")
    public Student register(@RequestBody Student student) {
        return studentService.registerStudent(student);
    }

    @GetMapping("/me")
    public Student getMyProfile(@RequestParam String regNo) {
        return studentService.getStudentByRegNo(regNo);
    }
    @GetMapping("/my-grievances")
    public List<Grievance> getMyGrievances(@RequestParam String regNo) {
        return studentService.getMyGrievances(regNo);
    }
}