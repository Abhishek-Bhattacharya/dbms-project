package com.hostel.hostelmanagement.repository;

import com.hostel.hostelmanagement.model.Worker;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkerRepository extends JpaRepository<Worker, Long> {
}