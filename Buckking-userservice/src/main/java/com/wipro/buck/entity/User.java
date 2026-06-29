package com.wipro.buck.entity;

import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	long id;
	
	@NotBlank
	@Size(min=3,max=40,message="Name cannot be empty")
	String name;
	
	@NotBlank
	@Column(unique = true)
	@Size(min=3,max=40,message="Name cannot be empty")
	String username;
	
	@NotBlank(message = "Email is required")
	@Column(unique=true)
	@Email
	String email;
	
	@NotBlank(message = "password cannot be empty")
	@Size(min=5,max=100)
	String password;
	
	private boolean blocked;
	
	@Pattern(regexp = "\\d{10}", message = "Mobile number must be 10 digits")
	private String mobile;
	

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
	        name = "user_roles",
	        joinColumns = @JoinColumn(name = "user_id"),
	        inverseJoinColumns = @JoinColumn(name = "role_id")
	)
	private Set<Role> roles;

    @OneToOne(
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @JoinColumn(name = "profile_id")
    private Profile profile;

	
	
}
