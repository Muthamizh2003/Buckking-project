package com.wipro.buck.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wipro.buck.DTO.RoleDTO;
import com.wipro.buck.services.RoleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public List<RoleDTO> getRoles() {

        return roleService.getAllRoles();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public RoleDTO createRole(
            @RequestBody RoleDTO dto) {

        return roleService.createRole(dto);
    }

    @PostMapping("/assign")
    @PreAuthorize("hasAnyRole('ADMIN','MODERATOR')")
    public ResponseEntity<Void> assignRole(
            @RequestBody Map<String, Object> body) {

        Long userId = Long.valueOf(body.get("userId").toString());
        String roleName = body.get("roleName").toString();

        roleService.assignRole(userId, roleName);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/remove")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> removeRole(
            @RequestBody Map<String, Object> body) {

        Long userId = Long.valueOf(body.get("userId").toString());
        String roleName = body.get("roleName").toString();

        roleService.removeRole(userId, roleName);
        return ResponseEntity.ok().build();
    }
}