package com.wipro.buck.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.wipro.buck.DTO.ProfileDTO;
import com.wipro.buck.services.ProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/{userId}")
    public ProfileDTO getProfile(
            @PathVariable Long userId) {

        return profileService.getProfile(userId);
    }

    @GetMapping("/by-username/{username}")
    public ProfileDTO getProfileByUsername(
            @PathVariable String username) {

        return profileService.getProfileByUsername(username);
    }

    @PutMapping("/{userId}")
    public ProfileDTO updateProfile(
            @PathVariable Long userId,
            @RequestBody ProfileDTO dto) {

        return profileService.updateProfile(userId, dto);
    }

    @PostMapping("/{userId}/avatar")
    public ResponseEntity<String> uploadAvatar(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {

        String result = profileService.uploadAvatar(userId, file);
        return ResponseEntity.ok(result);
    }
}