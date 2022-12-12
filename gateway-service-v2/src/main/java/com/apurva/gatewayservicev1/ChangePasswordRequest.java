package com.apurva.gatewayservicev1;

public class ChangePasswordRequest {
	String currentPasswordString;
	String newPasswordString;
	String confirmNewPasswordString;
	
	
	
	public ChangePasswordRequest() {
		super();
		// TODO Auto-generated constructor stub
	}
	public ChangePasswordRequest(String currentPasswordString, String newPasswordString,
			String confirmNewPasswordString) {
		super();
		this.currentPasswordString = currentPasswordString;
		this.newPasswordString = newPasswordString;
		this.confirmNewPasswordString = confirmNewPasswordString;
	}
	public String getCurrentPasswordString() {
		return currentPasswordString;
	}
	public void setCurrentPasswordString(String currentPasswordString) {
		this.currentPasswordString = currentPasswordString;
	}
	public String getNewPasswordString() {
		return newPasswordString;
	}
	public void setNewPasswordString(String newPasswordString) {
		this.newPasswordString = newPasswordString;
	}
	public String getConfirmNewPasswordString() {
		return confirmNewPasswordString;
	}
	public void setConfirmNewPasswordString(String confirmNewPasswordString) {
		this.confirmNewPasswordString = confirmNewPasswordString;
	}
	
	
}
