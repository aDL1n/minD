package dev.adlin.mind.config;

import lombok.Getter;
import lombok.Setter;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.AsyncSupportConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Setter
@Getter
@Configuration
@ConfigurationProperties("web")
public class WebMvcConfig implements WebMvcConfigurer {

    private String allowedFrontendOrigin;

    @Override
    public void addCorsMappings(final @NonNull CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(getAllowedFrontendOrigin())
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void configureAsyncSupport(final @NonNull AsyncSupportConfigurer configurer) {
        configurer.setDefaultTimeout(-1);
    }
}
