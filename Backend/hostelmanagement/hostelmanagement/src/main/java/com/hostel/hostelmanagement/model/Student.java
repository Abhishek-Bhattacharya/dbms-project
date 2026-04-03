package com.hostel.hostelmanagement.model;

import jakarta.persistence.*;

@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    private String name;
    private String email;
    private String password;
    private String registrationNumber;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    // Constructors
    public Student() {}

    public Student(String name, String email, String password, Room room) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.room = room;
    }

    // Getters & Setters

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public Long getStudentId() { return studentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }
}