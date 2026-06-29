package com.wipro.buck.DTO;

import java.util.List;

import jakarta.validation.constraints.*;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;

    @NotBlank(message = "Name cannot be empty")
    private String name;

    @Email
    @NotBlank
    private String email;
    private String username;
    private String password;
    private List<String> roles;
    private boolean blocked;
}