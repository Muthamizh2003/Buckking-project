package com.wipro.buck.DTO;

import lombok.Data;

@Data
public class ProfileDTO {

    private Long id;

    private String displayName;

    private String bio;

    private String avatarUrl;

    private String bannerUrl;

    private String location;

    private String website;

    private String githubUrl;

    private String linkedinUrl;

    private String mobile;

    private String email;
}