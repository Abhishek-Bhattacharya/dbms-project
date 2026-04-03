package com.hostel.hostelmanagement.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String registrationNumber;
    private String password;
    private String role; // STUDENT, WARDEN, ADMIN

    // Constructors
    public User() {}

    public User(String registrationNumber, String password, String role) {
        this.registrationNumber = registrationNumber;
        this.password = password;
        this.role = role;
    }

    // Getters & Setters
    public Long getUserId() { return userId; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}