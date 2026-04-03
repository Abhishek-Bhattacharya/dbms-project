package com.hostel.hostelmanagement.model;

import jakarta.persistence.*;

@Entity
public class Grievance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long grievanceId;

    private String type;        // plumbing, electrical, etc.
    private String description;
    private String status;
    private String timeSlot;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "worker_id")
    private Worker worker;

    // Constructors
    public Grievance() {}

    // Getters & Setters
    public Long getGrievanceId() { return grievanceId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Worker getWorker() { return worker; }
    public void setWorker(Worker worker) { this.worker = worker; }
}