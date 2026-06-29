package com.wipro.buck.config;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.wipro.buck.entity.Profile;
import com.wipro.buck.entity.Role;
import com.wipro.buck.entity.User;
import com.wipro.buck.repository.RoleRepository;
import com.wipro.buck.repository.UserRepository;
import com.wipro.buck.services.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;

    @Autowired(required = false)
    private OAuth2AuthorizedClientService authorizedClientService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        String provider = token.getAuthorizedClientRegistrationId();

        String providerId = token.getPrincipal().getName();
        String login = token.getPrincipal().getAttribute("login");
        String githubName = token.getPrincipal().getAttribute("name");

        String preferredUsername = login != null ? login : provider + "_" + providerId;
        final String displayName = githubName != null ? githubName : login != null ? login : provider + "_" + providerId;

        User user = userRepository.findByUsername(preferredUsername).orElseGet(() -> {

            String username = preferredUsername;
            if (userRepository.existsByUsername(username)) {
                username = provider + "_" + providerId;
            }
            final String newUsername = username;

            String email = token.getPrincipal().getAttribute("email");
            if (email == null && "github".equals(provider) && authorizedClientService != null) {
                email = fetchPrimaryEmail(token);
            }

            if (email != null && userRepository.existsByEmail(email)) {
                email = null;
            }

            final String newEmail = email;

            Profile profile = new Profile();
            profile.setDisplayName(displayName);

            Role userRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new RuntimeException("Default role not found"));

            User newUser = new User();
            newUser.setUsername(newUsername);
            newUser.setName(displayName);
            newUser.setEmail(newEmail != null ? newEmail : newUsername + "@" + provider + ".com");
            newUser.setPassword(UUID.randomUUID().toString());
            newUser.setRoles(Set.of(userRole));
            newUser.setProfile(profile);

            return userRepository.save(newUser);
        });

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .toList();

        String jwt = jwtService.generateToken(user.getUsername(), roles, user.getId(), user.getName());

        response.sendRedirect("http://localhost:5173/oauth2/callback?token=" + jwt);
    }

    private String fetchPrimaryEmail(OAuth2AuthenticationToken token) {

        try {
            OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                    token.getAuthorizedClientRegistrationId(),
                    token.getName());

            if (client == null || client.getAccessToken() == null) return null;

            String accessToken = client.getAccessToken().getTokenValue();

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<?> entity = new HttpEntity<>(headers);

            RestTemplate rest = new RestTemplate();
            List<Map<String, Object>> emails = rest.exchange(
                    "https://api.github.com/user/emails",
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            ).getBody();

            if (emails != null) {
                for (Map<String, Object> e : emails) {
                    if (Boolean.TRUE.equals(e.get("primary"))) {
                        return (String) e.get("email");
                    }
                }
            }
        } catch (Exception ignored) {
        }

        return null;
    }
}
