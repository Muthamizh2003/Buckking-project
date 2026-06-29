package com.wipro.buck.services;

import com.wipro.buck.DTO.AuthRequestDTO;
import com.wipro.buck.DTO.AuthResponseDTO;

public interface AuthService {

    AuthResponseDTO login(AuthRequestDTO request);
}