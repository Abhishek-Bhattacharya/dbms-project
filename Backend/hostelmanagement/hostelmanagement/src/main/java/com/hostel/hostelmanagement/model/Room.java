package com.hostel.hostelmanagement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;

    private int floor;
    private int roomNumber;
    private int capacity;
    private int occupiedCount;

    // Constructors
    public Room() {}

    public Room(int floor, int roomNumber, int capacity, int occupiedCount) {
        this.floor = floor;
        this.roomNumber = roomNumber;
        this.capacity = capacity;
        this.occupiedCount = occupiedCount;
    }

    // Getters and Setters
    public Long getRoomId() {
        return roomId;
    }

    public int getFloor() {
        return floor;
    }

    public void setFloor(int floor) {
        this.floor = floor;
    }

    public int getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(int roomNumber) {
        this.roomNumber = roomNumber;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getOccupiedCount() {
        return occupiedCount;
    }

    public void setOccupiedCount(int occupiedCount) {
        this.occupiedCount = occupiedCount;
    }
}