package com.hostel.hostelmanagement.controller;

import com.hostel.hostelmanagement.model.Room;
import com.hostel.hostelmanagement.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    // GET all rooms
    @GetMapping
    public List<Room> getRooms() {
        return roomService.getAllRooms();
    }

    // POST add room
    @PostMapping
    public Room addRoom(@RequestBody Room room) {
        return roomService.addRoom(room);
    }

    // GET available rooms
    @GetMapping("/available")
    public List<Room> getAvailableRooms() {
        return roomService.getAvailableRooms();
    }

    @PostMapping("/apply")
    public Room applyForRoom(@RequestParam String regNo) {
        return roomService.applyForRoom(regNo);
    }

    @DeleteMapping("/{id}")
    public String deleteRoom(
            @PathVariable Long id,
            @RequestParam String role) {

        if (!role.equals("ADMIN")) {
            throw new RuntimeException("Only ADMIN can delete rooms");
        }

        roomService.deleteRoom(id);
        return "Room deleted successfully";
    }
}