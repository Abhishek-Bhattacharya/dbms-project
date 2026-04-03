package com.hostel.hostelmanagement.repository;
import java.util.List;
import com.hostel.hostelmanagement.model.Grievance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrievanceRepository extends JpaRepository<Grievance, Long> {
    List<Grievance> findByStudentStudentId(Long studentId);
    List<Grievance> findByStatus(String status);

}