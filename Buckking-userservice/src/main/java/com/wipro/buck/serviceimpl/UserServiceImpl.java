package com.wipro.buck.serviceimpl;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.wipro.buck.DTO.RegisterRequestDTO;
import com.wipro.buck.DTO.UserDTO;
import com.wipro.buck.entity.Profile;
import com.wipro.buck.entity.Role;
import com.wipro.buck.entity.User;
import com.wipro.buck.repository.RoleRepository;
import com.wipro.buck.repository.UserRepository;
import com.wipro.buck.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDTO register(RegisterRequestDTO request) {

        if(userRepository.existsByUsername(request.getUsername()))
            throw new RuntimeException("Username already exists");

        if(userRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already exists");

        Role role = roleRepository.findByName("USER")
                .orElseThrow();

        Profile profile = new Profile();

        User user = new User();

        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setMobile(request.getMobile());

        user.setRoles(Set.of(role));
        user.setProfile(profile);

        User saved = userRepository.save(user);

        return mapToDTO(saved);
    }

    @Override
    public UserDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow();

        return mapToDTO(user);
    }

    @Override
    public UserDTO getUserByUsername(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        return mapToDTO(user);
    }

    @Override
    public List<UserDTO> getUsersByRole(String roleName) {

        return userRepository.findAll()
                .stream()
                .filter(u -> u.getRoles().stream()
                        .anyMatch(r -> r.getName().equalsIgnoreCase(roleName)))
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public List<UserDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public List<UserDTO> getNonAdminUsers() {

        return userRepository.findAll()
                .stream()
                .filter(u -> u.getRoles().stream()
                        .noneMatch(r -> r.getName().equals("ADMIN")))
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO dto) {

        User user = userRepository.findById(id)
                .orElseThrow();

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());

        return mapToDTO(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public void blockUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow();

        user.setBlocked(true);

        userRepository.save(user);
    }

    @Override
    public void removeUserFromCommunity(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        boolean isAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getName().equals("ADMIN"));

        if (isAdmin) {
            throw new RuntimeException("Cannot remove an admin user");
        }

        user.setBlocked(true);
        userRepository.save(user);
    }

    @Override
    public void unblockUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow();

        user.setBlocked(false);

        userRepository.save(user);
    }

    private UserDTO mapToDTO(User user) {

        UserDTO dto = new UserDTO();

        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setBlocked(user.isBlocked());

        dto.setRoles(
            user.getRoles()
                .stream()
                .map(Role::getName)
                .toList()
        );

        return dto;
    }

    private Role findRole(String name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Role not found: " + name));
    }
}