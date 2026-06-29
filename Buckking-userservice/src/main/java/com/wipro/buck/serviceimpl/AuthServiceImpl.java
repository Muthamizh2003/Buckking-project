package com.wipro.buck.serviceimpl;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.wipro.buck.DTO.AuthRequestDTO;
import com.wipro.buck.DTO.AuthResponseDTO;
import com.wipro.buck.entity.Role;
import com.wipro.buck.entity.User;
import com.wipro.buck.repository.UserRepository;
import com.wipro.buck.services.AuthService;
import com.wipro.buck.services.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public AuthResponseDTO login(AuthRequestDTO request) {

        String username = request.getUsername();

        User user = userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.findByEmail(username)
                        .orElseThrow(() -> new BadCredentialsException("User not found with username/email: " + username)));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        request.getPassword()
                )
        );

        List<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .toList();

        String token =
                jwtService.generateToken(
                        user.getUsername(),
                        roles,
                        user.getId(),
                        user.getName()
                );

        return new AuthResponseDTO(token);
    }
}
