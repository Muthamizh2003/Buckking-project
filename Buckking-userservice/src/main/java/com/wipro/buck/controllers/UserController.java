package com.wipro.buck.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wipro.buck.DTO.RegisterRequestDTO;
import com.wipro.buck.DTO.UserDTO;
import com.wipro.buck.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public UserDTO register(
            @RequestBody RegisterRequestDTO dto) {

        return userService.register(dto);
    }

    @GetMapping("/{id}")
    public UserDTO getUser(
            @PathVariable Long id) {

        return userService.getUserById(id);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MODERATOR')")
    public List<UserDTO> getAllUsers() {

        return userService.getAllUsers();
    }

    @GetMapping("/regular")
    @PreAuthorize("hasAnyRole('ADMIN','MODERATOR')")
    public List<UserDTO> getNonAdminUsers() {

        return userService.getNonAdminUsers();
    }

    @GetMapping("/by-role/{roleName}")
    @PreAuthorize("hasAnyRole('ADMIN','MODERATOR')")
    public List<UserDTO> getUsersByRole(
            @PathVariable String roleName) {

        return userService.getUsersByRole(roleName);
    }

    @GetMapping("/username/{username}")
    public UserDTO getUserByUsername(
            @PathVariable String username) {

        return userService.getUserByUsername(username);
    }

    @PutMapping("/{id}")
    public UserDTO updateUser(
            @PathVariable Long id,
            @RequestBody UserDTO dto) {

        return userService.updateUser(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> blockUser(
            @PathVariable Long id) {

        userService.blockUser(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/unblock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> unblockUser(
            @PathVariable Long id) {

        userService.unblockUser(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/remove")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<Void> removeUserFromCommunity(
            @PathVariable Long id) {

        userService.removeUserFromCommunity(id);
        return ResponseEntity.ok().build();
    }
}