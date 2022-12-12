package com.kafka.resources;

public class Email {
	private String recipient;
	private String subject;
	private String text;
	private String eventType;
	
	public String getRecipient() {
		return recipient;
	}
	public void setRecipient(String recipient) {
		this.recipient = recipient;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getEventType() {
		return eventType;
	}
	public void setEventType(String eventType) {
		this.eventType = eventType;
	}
	
	@Override
	public String toString() {
		return this.eventType + "\n" + this.recipient+ "\n"+ this.subject+"\n"+this.text;
	}
	
}
