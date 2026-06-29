package com.wipro.buck.serviceimpl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.wipro.buck.DTO.ProfileDTO;
import com.wipro.buck.entity.Profile;
import com.wipro.buck.entity.User;
import com.wipro.buck.repository.ProfileRepository;
import com.wipro.buck.repository.UserRepository;
import com.wipro.buck.services.ProfileService;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    @Value("${app.upload.dir:uploads/avatars}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    @Override
    public ProfileDTO getProfile(Long userId) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        return toDTO(user);
    }

    @Override
    public ProfileDTO getProfileByUsername(String username) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        return toDTO(user);
    }

    private ProfileDTO toDTO(User user) {

        Profile profile = user.getProfile();

        ProfileDTO dto = new ProfileDTO();

        dto.setId(profile.getId());
        dto.setDisplayName(profile.getDisplayName());
        dto.setBio(profile.getBio());
        dto.setAvatarUrl(profile.getAvatarUrl());
        dto.setBannerUrl(profile.getBannerUrl());
        dto.setWebsite(profile.getWebsite());
        dto.setGithubUrl(profile.getGithubUrl());
        dto.setLinkedinUrl(profile.getLinkedinUrl());
        dto.setLocation(profile.getLocation());
        dto.setMobile(user.getMobile());
        dto.setEmail(user.getEmail());

        return dto;
    }

    @Override
    public ProfileDTO updateProfile(
            Long userId,
            ProfileDTO dto) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Profile profile = user.getProfile();

        profile.setDisplayName(dto.getDisplayName());
        profile.setBio(dto.getBio());
        profile.setWebsite(dto.getWebsite());
        profile.setGithubUrl(dto.getGithubUrl());
        profile.setLinkedinUrl(dto.getLinkedinUrl());
        profile.setLocation(dto.getLocation());
        profile.setUpdatedAt(Instant.now());

        if (dto.getMobile() != null) {
            user.setMobile(dto.getMobile());
        }
        if (dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
        }
        if (dto.getMobile() != null || dto.getEmail() != null) {
            userRepository.save(user);
        }

        profileRepository.save(profile);

        return dto;
    }

    @Override
    public String uploadAvatar(
            Long userId,
            MultipartFile file) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {
            Path targetPath = Paths.get(uploadDir).resolve(fileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            Profile profile = user.getProfile();
            profile.setAvatarUrl("/uploads/avatars/" + fileName);
            profileRepository.save(profile);

            return "Avatar uploaded successfully: " + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload avatar", e);
        }
    }
}
