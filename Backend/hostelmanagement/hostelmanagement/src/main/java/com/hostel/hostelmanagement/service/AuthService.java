package com.hostel.hostelmanagement.service;

import com.hostel.hostelmanagement.model.Student;
import com.hostel.hostelmanagement.model.User;
import com.hostel.hostelmanagement.repository.StudentRepository;
import com.hostel.hostelmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User login(String registrationNumber, String password) {

        User user = userRepository
                .findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
    @Autowired
    private StudentRepository studentRepository;

    public User register(User user) {

        if (userRepository
                .findByRegistrationNumber(user.getRegistrationNumber())
                .isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User savedUser = userRepository.save(user);

        if (user.getRole().equals("STUDENT")) {
            Student student = new Student();
            student.setRegistrationNumber(user.getRegistrationNumber());
            studentRepository.save(student);
        }

        return savedUser;
    }
}