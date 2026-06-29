package com.wipro.buck.securityservices;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.wipro.buck.entity.User;
import com.wipro.buck.repository.UserRepository;

@Service
public class UserDetailsServiceImp implements UserDetailsService {  // UserDetailsServiceImp class

    @Autowired
    private UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userInfo = repository.findByUsername(username);
        
        return userInfo.map(UserDetailsImp::new) 
                .orElseThrow(() -> new UsernameNotFoundException("user not found " + username));

    }
}
