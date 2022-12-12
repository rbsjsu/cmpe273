package com.apurva.gatewayservicev1.kafka;

import java.text.MessageFormat;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.apurva.gatewayservicev1.User;

@Service
public class KafkaController {

	@Autowired
	private KafkaTemplate<String,Email> template;
	
	@Value("${my.kafka.email.topic}")
	private String topic;

	@Autowired
	private EmailTemplate emailTemplate;
	
	public String passwordUpdate(User user) {
		try {
		Email email = new Email();
		email.setEventType("SIMPLE_EMAIL");
		email.setRecipient(user.getEmailString());
		email.setSubject("Change Password");
		
		
		
		String text = emailTemplate.getUpdatePassword(user.getFirstNameString(), user.getEmailString());
		
		email.setText(Base64.getEncoder().encodeToString(text.getBytes()));
		
		
		template.send("EmailStream", email);
		return "Password Changed Successfully";
		}catch(Exception e) {
			return "Error" + e.getMessage();
		}
	}

	public String forgotPassword(User user, String password) {
		try {
		Email email = new Email();
		email.setEventType("SIMPLE_EMAIL");
		email.setRecipient(user.getEmailString());
		email.setSubject("Forgot Password");
		
		
		
		String text = emailTemplate.getForgotPassword(user.getFirstNameString(), user.getEmailString(), password);
		
		email.setText(Base64.getEncoder().encodeToString(text.getBytes()));
		
		
		template.send("EmailStream", email);
		return "New Password Sent Succesfully !!!";
		}catch(Exception e) {
			return "Error" + e.getMessage();
		}
	}

	public String signUpNotification(User user) {
		try {
		Email email = new Email();
		email.setEventType("SIMPLE_EMAIL");
		email.setRecipient(user.getEmailString());
		email.setSubject("Account Created !");
		
		
		String confirmAccountUrl="http://localhost:8081/confirm-account?confirmationToken=" + user.getConfirmationTokenString();
		String text = emailTemplate.greetings(user.getFirstNameString() + " " + user.getLastNameString(), confirmAccountUrl);
		
		
		
		email.setText(Base64.getEncoder().encodeToString(text.getBytes()));
		
		
		template.send("EmailStream", email);
		return "User Registerd and Greetings Sent Succesfully !!!";
		}catch(Exception e) {
			return "Error" + e.getMessage();
		}
	}
}
