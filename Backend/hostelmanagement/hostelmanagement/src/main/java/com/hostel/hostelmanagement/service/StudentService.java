package com.hostel.hostelmanagement.service;

import com.hostel.hostelmanagement.model.Grievance;
import com.hostel.hostelmanagement.model.Room;
import com.hostel.hostelmanagement.model.Student;
import com.hostel.hostelmanagement.repository.GrievanceRepository;
import com.hostel.hostelmanagement.repository.RoomRepository;
import com.hostel.hostelmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private GrievanceRepository grievanceRepository;

    public List<Grievance> getMyGrievances(String regNo) {

        Student student = studentRepository
                .findByRegistrationNumber(regNo)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return grievanceRepository.findByStudentStudentId(student.getStudentId());
    }

    public Student registerStudent(Student student) {

        // Get available rooms
        List<Room> rooms = roomRepository.findAvailableRooms();

        if (rooms.isEmpty()) {
            throw new RuntimeException("No rooms available");
        }

        // Random allocation
        Collections.shuffle(rooms);
        Room assignedRoom = rooms.get(0);

        // Update occupancy
        assignedRoom.setOccupiedCount(assignedRoom.getOccupiedCount() + 1);
        roomRepository.save(assignedRoom);

        // Assign room to student
        student.setRoom(assignedRoom);

        return studentRepository.save(student);
    }

    public Student getStudentByRegNo(String regNo) {
        return studentRepository
                .findByRegistrationNumber(regNo)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }
}