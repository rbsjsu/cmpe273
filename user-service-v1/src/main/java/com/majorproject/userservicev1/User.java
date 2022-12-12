package com.majorproject.userservicev1;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

@Entity
@Table(name = "User")
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer userIdInteger;
	
	@Email
	@NotEmpty
	@Column(unique = true)
	private String emailString;
	
	@NotEmpty
	private String passwordString;
	
	@NotEmpty
	private String firstNameString;
	
	@NotEmpty
	private String lastNameString;
	
	private String role;
	
	@NotEmpty
	private String phoneNumberString;
	
	private boolean isEnabled;
	
	private String confirmationTokenString;
	
	public User() {
		
	}
	
	public User(Integer userIdInteger, @Email @NotEmpty String emailString, String passwordString,
			String firstNameString, String lastNameString, String phoneNumberString) {
		super();
		this.userIdInteger = userIdInteger;
		this.emailString = emailString;
		this.passwordString = passwordString;
		this.firstNameString = firstNameString;
		this.lastNameString = lastNameString;
		this.phoneNumberString = phoneNumberString;
		this.isEnabled = false;
		this.confirmationTokenString = UUID.randomUUID().toString();
		
	}
	
	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public Integer getUserIdInteger() {
		return userIdInteger;
	}

	public void setUserIdInteger(Integer userIdInteger) {
		this.userIdInteger = userIdInteger;
	}

	public String getEmailString() {
		return emailString;
	}

	public void setEmailString(String emailString) {
		this.emailString = emailString;
	}

	public String getPasswordString() {
		return passwordString;
	}

	public void setPasswordString(String passwordString) {
		this.passwordString = passwordString;
	}

	public String getFirstNameString() {
		return firstNameString;
	}

	public void setFirstNameString(String firstNameString) {
		this.firstNameString = firstNameString;
	}

	public String getLastNameString() {
		return lastNameString;
	}

	public void setLastNameString(String lastNameString) {
		this.lastNameString = lastNameString;
	}

	public String getPhoneNumberString() {
		return phoneNumberString;
	}

	public void setPhoneNumberString(String phoneNumberString) {
		this.phoneNumberString = phoneNumberString;
	}

	public boolean isEnabled() {
		return isEnabled;
	}

	public void setEnabled(boolean isEnabled) {
		this.isEnabled = isEnabled;
	}

	public String getConfirmationTokenString() {
		return confirmationTokenString;
	}

	public void setConfirmationTokenString(String confirmationTokenString) {
		this.confirmationTokenString = confirmationTokenString;
	}
	
	
	
	
}
