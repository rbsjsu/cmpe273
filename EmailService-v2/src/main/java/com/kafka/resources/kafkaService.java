package com.kafka.resources;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.emailService.model.SimpleEmail;



@Service 
public class kafkaService {

	@Autowired
	private emailServiceController emailController;
	
	@KafkaListener( topics="EmailStream", containerFactory="kafkaListnerContainerFactory")
	public void kafkaListner(Email msg) {
		
		if (msg.getEventType().equalsIgnoreCase("SIMPLE_EMAIL")) {

			SimpleEmail email = new SimpleEmail();
			email.setRecipient(msg.getRecipient());
			email.setSubject(msg.getSubject());
			email.setText(msg.getText());
			
			System.out.println("Message Consumed.....");
			try {
				emailController.sendSingleMail(email);
				System.out.println("Email Sent to " + email.getRecipient());
			} catch (MessagingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		} else {
			System.out.println("type mismatch");
		}
	}
	
	@KafkaListener( topics="paymentStream", containerFactory="kafkaListnerContainerFactory")
	public void paymentListner(Email e) {
		System.out.println(e.toString());
	}
}
