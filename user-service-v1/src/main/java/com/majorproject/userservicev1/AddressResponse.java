package com.majorproject.userservicev1;

public class AddressResponse {
	private Integer addressIdInteger;
	private String firstLineString;
	private String secondLineString;
	private String thirdLineString;
	private String cityNameString;
	private String pincodeString;
	public Integer getAddressIdInteger() {
		return addressIdInteger;
	}
	public void setAddressIdInteger(Integer addressIdInteger) {
		this.addressIdInteger = addressIdInteger;
	}
	public String getFirstLineString() {
		return firstLineString;
	}
	public void setFirstLineString(String firstLineString) {
		this.firstLineString = firstLineString;
	}
	public String getSecondLineString() {
		return secondLineString;
	}
	public void setSecondLineString(String secondLineString) {
		this.secondLineString = secondLineString;
	}
	public String getThirdLineString() {
		return thirdLineString;
	}
	public void setThirdLineString(String thirdLineString) {
		this.thirdLineString = thirdLineString;
	}
	public String getCityNameString() {
		return cityNameString;
	}
	public void setCityNameString(String cityNameString) {
		this.cityNameString = cityNameString;
	}
	public String getPincodeString() {
		return pincodeString;
	}
	public void setPincodeString(String pincodeString) {
		this.pincodeString = pincodeString;
	}
	
}
