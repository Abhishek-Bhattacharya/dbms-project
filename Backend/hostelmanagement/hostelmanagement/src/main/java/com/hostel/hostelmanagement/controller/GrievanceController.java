package com.hostel.hostelmanagement.controller;

import com.hostel.hostelmanagement.model.Grievance;
import com.hostel.hostelmanagement.repository.GrievanceRepository;
import com.hostel.hostelmanagement.service.GrievanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grievances")
public class GrievanceController {

    @Autowired
    private GrievanceService grievanceService;

    @PostMapping
    public Grievance create(@RequestBody Grievance grievance) {
        return grievanceService.createGrievance(grievance);
    }
    @Autowired
    private GrievanceRepository grievanceRepository;

    @PutMapping("/assign")
    public Grievance assignWorker(
            @RequestParam Long grievanceId,
            @RequestParam Long workerId,
            @RequestParam String role) {

        if (!role.equals("WARDEN")) {
            throw new RuntimeException("Only WARDEN can assign workers");
        }

        return grievanceService.assignWorker(grievanceId, workerId);
    }
    // Get all grievances (warden view)
    @GetMapping
    public List<Grievance> getAllGrievances() {
        return grievanceRepository.findAll();
    }

    // Filter by status (PENDING / ASSIGNED)
    @GetMapping("/status")
    public List<Grievance> getByStatus(@RequestParam String status) {
        return grievanceRepository.findByStatus(status);
    }
    @PutMapping("/update-status")
    public Grievance updateStatus(
            @RequestParam Long grievanceId,
            @RequestParam String status) {

        Grievance g = grievanceRepository.findById(grievanceId).get();
        g.setStatus(status);

        return grievanceRepository.save(g);
    }
}