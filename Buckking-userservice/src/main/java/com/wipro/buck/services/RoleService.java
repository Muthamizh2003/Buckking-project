package com.wipro.buck.services;

import java.util.List;

import com.wipro.buck.DTO.RoleDTO;

public interface RoleService {

    List<RoleDTO> getAllRoles();

    RoleDTO createRole(RoleDTO dto);

    void assignRole(Long userId, String roleName);

    void removeRole(Long userId, String roleName);
}