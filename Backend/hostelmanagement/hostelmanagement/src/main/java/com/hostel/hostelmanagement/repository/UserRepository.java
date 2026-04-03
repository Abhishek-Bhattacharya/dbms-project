package com.hostel.hostelmanagement.repository;

import com.hostel.hostelmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByRegistrationNumber(String registrationNumber);
}