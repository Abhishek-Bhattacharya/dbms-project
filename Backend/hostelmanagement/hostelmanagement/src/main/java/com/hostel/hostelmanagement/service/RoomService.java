package com.hostel.hostelmanagement.service;

import com.hostel.hostelmanagement.model.Room;
import com.hostel.hostelmanagement.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

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
    public void deleteRoom(Long id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (room.getOccupiedCount() > 0) {
            throw new RuntimeException("Cannot delete room: students are assigned");
        }

        roomRepository.deleteById(id);
    }
}