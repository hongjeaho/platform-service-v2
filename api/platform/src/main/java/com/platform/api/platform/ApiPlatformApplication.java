package com.platform.api.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {
	"com.platform.common.core",
	"com.platform.datasource.platform",
	"com.platform.common.web",
	"com.platform.api.platform",
})
@EnableScheduling
public class ApiPlatformApplication {
	public static void main(final String[] args) {
		SpringApplication.run(ApiPlatformApplication.class, args);
	}
}