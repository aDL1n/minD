package dev.adlin.mind.configuration;

import lombok.Getter;
import lombok.Setter;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.AsyncSupportConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Setter
@Getter
@EnableWebMvc
@Configuration
@ConfigurationProperties("web")
public class WebMvcConfiguration implements WebMvcConfigurer {

    private String allowedFrontendOrigin;

    @Override
    public void addCorsMappings(final @NonNull CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(getAllowedFrontendOrigin())
                .allowedMethods("GET", "POST")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void configureAsyncSupport(final @NonNull AsyncSupportConfigurer configurer) {
        configurer.setDefaultTimeout(-1);
    }
}
