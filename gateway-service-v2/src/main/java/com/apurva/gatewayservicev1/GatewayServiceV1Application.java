package com.apurva.gatewayservicev1;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;

@SpringBootApplication
@EnableZuulProxy
@EnableDiscoveryClient
public class GatewayServiceV1Application {

	public static void main(String[] args) {
		SpringApplication.run(GatewayServiceV1Application.class, args);
	}
	
	@Bean
	public NewTopic topic() {
		return TopicBuilder.name("EmailStream")
				.partitions(1)
				.replicas(1)
				.build();
	}

}
