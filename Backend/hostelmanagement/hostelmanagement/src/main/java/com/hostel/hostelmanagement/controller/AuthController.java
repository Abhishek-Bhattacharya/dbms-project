package com.hostel.hostelmanagement.controller;

import com.hostel.hostelmanagement.model.User;
import com.hostel.hostelmanagement.repository.UserRepository;
import com.hostel.hostelmanagement.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public Object login(@RequestBody User user) {

        User loggedInUser = authService.login(
                user.getRegistrationNumber(),
                user.getPassword()
        );

        return new Object() {
            public Long userId = loggedInUser.getUserId();
            public String registrationNumber = loggedInUser.getRegistrationNumber();
            public String role = loggedInUser.getRole();
        };
    }
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }
}