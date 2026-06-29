package com.wipro.buck.serviceimpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.wipro.buck.DTO.RoleDTO;
import com.wipro.buck.entity.Role;
import com.wipro.buck.entity.User;
import com.wipro.buck.repository.RoleRepository;
import com.wipro.buck.repository.UserRepository;
import com.wipro.buck.services.RoleService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public List<RoleDTO> getAllRoles() {

        return roleRepository.findAll()
                .stream()
                .map(role ->
                        new RoleDTO(
                                (long) role.getId(),
                                role.getName()
                        ))
                .toList();
    }

    @Override
    public RoleDTO createRole(RoleDTO dto) {

        Role role = new Role();

        role.setName(dto.getName());

        Role saved = roleRepository.save(role);

        return new RoleDTO(
                (long) saved.getId(),
                saved.getName()
        );
    }

    @Override
    public void assignRole(
            Long userId,
            String roleName) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Role role = roleRepository
                .findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        user.getRoles().add(role);

        userRepository.save(user);
    }

    @Override
    public void removeRole(
            Long userId,
            String roleName) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Role role = roleRepository
                .findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        user.getRoles().remove(role);

        userRepository.save(user);
    }
}