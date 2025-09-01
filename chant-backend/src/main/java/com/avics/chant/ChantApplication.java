package com.avics.chant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.avics.chant")
public class ChantApplication{

	public static void main(String[] args) {
		SpringApplication.run(ChantApplication.class, args);
	}

}
