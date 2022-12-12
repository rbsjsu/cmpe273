package com.apurva.recommenderservice;


public class User {
	private Integer userIdInteger;
	
	private String emailString;
	
	private String passwordString;
	
	private String firstNameString;
	
	private String lastNameString;
	
	private String role;
	
	private String phoneNumberString;
	
	private boolean isEnabled;
	
	private String confirmationTokenString;

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

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
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
