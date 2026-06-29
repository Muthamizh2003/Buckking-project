package com.wipro.buck.DTO;

import lombok.Data;

@Data
public class RegisterRequestDTO {

    private String name;

    private String username;

    private String email;

    private String password;

    private String mobile;
}