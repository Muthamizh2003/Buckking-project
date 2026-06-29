package com.wipro.buck.services;

import java.util.List;

import com.wipro.buck.DTO.RegisterRequestDTO;
import com.wipro.buck.DTO.UserDTO;

public interface UserService {

    UserDTO register(RegisterRequestDTO request);

    UserDTO getUserById(Long id);

    UserDTO getUserByUsername(String username);

    List<UserDTO> getAllUsers();

    List<UserDTO> getUsersByRole(String roleName);

    UserDTO updateUser(Long id, UserDTO userDTO);

    void deleteUser(Long id);

    void blockUser(Long id);

    void unblockUser(Long id);

    List<UserDTO> getNonAdminUsers();

    void removeUserFromCommunity(Long id);
}