package com.hostel.hostelmanagement.service;

import com.hostel.hostelmanagement.model.Grievance;
import com.hostel.hostelmanagement.model.Worker;
import com.hostel.hostelmanagement.repository.GrievanceRepository;
import com.hostel.hostelmanagement.repository.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GrievanceService {

    @Autowired
    private GrievanceRepository grievanceRepository;

    @Autowired
    private WorkerRepository workerRepository;

    public Grievance createGrievance(Grievance grievance) {
        grievance.setStatus("PENDING");
        return grievanceRepository.save(grievance);
    }

    public Grievance assignWorker(Long grievanceId, Long workerId) {

        Grievance grievance = grievanceRepository.findById(grievanceId).get();
        Worker worker = workerRepository.findById(workerId).get();

        grievance.setWorker(worker);
        grievance.setStatus("ASSIGNED");

        return grievanceRepository.save(grievance);
    }
}