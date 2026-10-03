package dev.adlin.mind;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
