package com.hostel.hostelmanagement.service;

import com.hostel.hostelmanagement.model.Room;
import com.hostel.hostelmanagement.model.Student;
import com.hostel.hostelmanagement.repository.RoomRepository;
import com.hostel.hostelmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private StudentRepository studentRepository;

    // Get all rooms
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // Add room
    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    public List<Room> getAvailableRooms() {
        return roomRepository.findAvailableRooms();
    }

    public Room applyForRoom(String regNo) {
        Student student = studentRepository.findByRegistrationNumber(regNo)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getRoom() != null) {
            return student.getRoom();
        }

        List<Room> rooms = roomRepository.findAvailableRooms();
        if (rooms.isEmpty()) {
            throw new RuntimeException("No rooms available");
        }

        Room assignedRoom = rooms.get(0);
        assignedRoom.setOccupiedCount(assignedRoom.getOccupiedCount() + 1);
        roomRepository.save(assignedRoom);

        student.setRoom(assignedRoom);
        studentRepository.save(student);

        return assignedRoom;
    }

    public void deleteRoom(Long id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (room.getOccupiedCount() > 0) {
            throw new RuntimeException("Cannot delete room: students are assigned");
        }

        roomRepository.deleteById(id);
    }
}