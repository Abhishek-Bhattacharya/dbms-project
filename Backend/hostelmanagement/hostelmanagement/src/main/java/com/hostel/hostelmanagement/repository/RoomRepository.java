package com.hostel.hostelmanagement.repository;

import com.hostel.hostelmanagement.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // Custom query to get rooms with available space
    @Query("SELECT r FROM Room r WHERE r.occupiedCount < r.capacity")
    List<Room> findAvailableRooms();
}