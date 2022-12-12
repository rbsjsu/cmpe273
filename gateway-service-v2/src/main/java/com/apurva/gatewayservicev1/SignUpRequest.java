package com.apurva.gatewayservicev1;


public class SignUpRequest {
	private String firstNameString;
	private String lastNameString;
	private String phoneNumberString;
	private String emailString;
	private String passwordString;
	private String confirmPasswordString;
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
	public String getConfirmPasswordString() {
		return confirmPasswordString;
	}
	public void setConfirmPasswordString(String confirmPasswordString) {
		this.confirmPasswordString = confirmPasswordString;
	}
	
	

}
