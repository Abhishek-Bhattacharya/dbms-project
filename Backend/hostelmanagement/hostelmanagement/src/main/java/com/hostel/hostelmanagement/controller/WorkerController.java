package com.hostel.hostelmanagement.controller;

import com.hostel.hostelmanagement.model.Worker;
import com.hostel.hostelmanagement.repository.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
public class WorkerController {

    @Autowired
    private WorkerRepository workerRepository;

    @GetMapping
    public List<Worker> getAllWorkers() {
        return workerRepository.findAll();
    }

    @PostMapping
    public Worker addWorker(
            @RequestBody Worker worker,
            @RequestParam String role) {

        if (!role.equals("ADMIN")) {
            throw new RuntimeException("Only ADMIN can add workers");
        }

        return workerRepository.save(worker);
    }
}