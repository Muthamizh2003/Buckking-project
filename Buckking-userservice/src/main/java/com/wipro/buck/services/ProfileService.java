package com.wipro.buck.services;

import org.springframework.web.multipart.MultipartFile;

import com.wipro.buck.DTO.ProfileDTO;

public interface ProfileService {

    ProfileDTO getProfile(Long userId);

    ProfileDTO getProfileByUsername(String username);

    ProfileDTO updateProfile(
            Long userId,
            ProfileDTO profileDTO);

    String uploadAvatar(
            Long userId,
            MultipartFile file);
}