package com.wipro.buck.config;

import java.time.Instant;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.wipro.buck.entity.Profile;
import com.wipro.buck.entity.Role;
import com.wipro.buck.entity.User;
import com.wipro.buck.repository.RoleRepository;
import com.wipro.buck.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataSeeder
        implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (roleRepository.count() == 0) {

            roleRepository.save(new Role(0, "USER"));
            roleRepository.save(new Role(0, "MODERATOR"));
            roleRepository.save(new Role(0, "ADMIN"));
        }

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("USER role not found"));
        Role modRole = roleRepository.findByName("MODERATOR")
                .orElseThrow(() -> new RuntimeException("MODERATOR role not found"));
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

        if (userRepository.findByUsername("admin").isEmpty()) {

            Profile adminProfile = new Profile();
            adminProfile.setDisplayName("Admin");
            adminProfile.setCreatedAt(Instant.now());

            User admin = new User();
            admin.setName("Admin");
            admin.setUsername("admin");
            admin.setEmail("admin@buckking.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setMobile("0000000000");
            admin.setRoles(Set.of(userRole, adminRole));
            admin.setProfile(adminProfile);
            userRepository.save(admin);
        }

        if (userRepository.findByUsername("moderator").isEmpty()) {

            Profile modProfile = new Profile();
            modProfile.setDisplayName("Moderator");
            modProfile.setCreatedAt(Instant.now());

            User moderator = new User();
            moderator.setName("Moderator");
            moderator.setUsername("moderator");
            moderator.setEmail("mod@buckking.com");
            moderator.setPassword(passwordEncoder.encode("mod12345"));
            moderator.setMobile("0000000001");
            moderator.setRoles(Set.of(userRole, modRole));
            moderator.setProfile(modProfile);
            userRepository.save(moderator);
        }
    }
}
